package main

import (
  "strings"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
  "github.com/labstack/echo"

  "errors"
  "reflect"
)

type Votes struct {
  Count int `json:"count"`
  Percentage float64 `json:"percentage"`
  OverallPercentage float64 `json:"overallPercentage"`
}

type PresidentialCandidate struct {
  Id bson.ObjectId `json:"id" bson:"_id,omitempty"`
  Party string  `json:"party"`
  Candidate string `json:"candidate"`
  RunningMate string `json:"runningMate"`
  CandidateImage string `json:"candidateImage"`
  Results []mgo.DBRef `json:"votes"`
}

type ParliamentaryCandidate struct {
  Id bson.ObjectId `json:"id" bson:"_id,omitempty"`
  Constituency string `json:"constituency"`
  Party string `json:"party"`
  Candidate string `json:"candidate"`
  CandidateImage string `json:"candidateImage"`
  Result mgo.DBRef `json:"result"`
}

type Parliamentarians struct {
  Id bson.ObjectId `json:"id" bson:"_id,omitempty"`
  Constituency string `json:"constituency"`
  Count int `json:"count"`
  Candidates []ParliamentaryCandidate `json:"candidates"`
}

type Result struct {
  Id bson.ObjectId `json:"id" bson:"_id,omitempty"`
  Type string `json:"type"`
  Candidate mgo.DBRef "candidate"
  Constituency string `json:"constituency"`
  Votes Votes `json:"votes"`
}

type ResultObject struct {
  Type string `json:"type"`
  Candidate bson.ObjectId "candidate"
  Constituency string `json:"constituency"`
  Votes Votes `json:"votes"`
}

type ResultArray struct {
  Data []ResultObject `json:"data"`
}

type Constituency struct {
  Id bson.ObjectId `json:"id" bson:"_id,omitempty"`
  Name string `json:"name"`
  District string  `json:"district"`
  Results []Result  `json:"results"`
}

type Task struct{
  Candidate interface{}
  SumConstVotes int
  SumCandVotes int
  Result Result
}

func init() {
  conn, err := ConnectMongo()
  defer conn.Close()

  if err != nil {
    panic("failed to connect to mongo")
  }


  // Loading constituencies to Database
  c := conn.DB("Election2016").C("Constituencies")
  count, err := c.Find(nil).Count()

  if err != nil {
    panic("Failed to get constituencies")
  }

  if count == 0 {
    //load constituencies into database
    constituencies, err := ReadLines("server/constituencies_.txt")
    if err != nil {
      panic(err)
    }

    for _, constituencyName := range constituencies {
      constituency := Constituency{
        Name: constituencyName,
      }

      err := c.Insert(constituency)
      if err != nil {
        panic("Failed to add constituency " + constituency.Name)
      }
    }
  }

  // Loading PresidentialCandidates to Database
  p := conn.DB("Election2016").C("Presidential")
  count, err = p.Find(nil).Count()
  
  if err != nil {
    panic("Failed to get Presidential Candidates")
  }

  if count == 0 {
    parties, err := ReadLines("server/parties.txt")
    if err != nil {
      panic("Failed to read parties from file")
    }

    for _, partyLine := range parties {
      partyDetails := strings.Split(partyLine, ",")
      partyName := strings.TrimSpace(partyDetails[0])
      partyCandidate := strings.TrimSpace(partyDetails[1])
      runningMate := strings.TrimSpace(partyDetails[2])

      pc := PresidentialCandidate{
        Party: partyName,
        Candidate: partyCandidate,
        RunningMate: runningMate,
      }

      err := p.Insert(pc)

      if err != nil {
        panic("Failed to insert Presidential Candidate " + pc.Candidate)
      }
    }
  }

  // Loading Parliamentary Candidates
  pcd := conn.DB("Election2016").C("Parliamentary")
  count, err = pcd.Find(nil).Count()

  if err != nil {
    panic("Failed to get Parliamentary Candidates")
  }

  if count == 0 {
    pcdLines, err := ReadLines("server/pcd.txt")
    if err != nil {
      panic("Failed to get Parliamentary candidates")
    }

    for _, pcandidate := range pcdLines {
      pcdData := strings.Split(pcandidate, ",")
      constituency := pcdData[0]
      contestants := pcdData[1:]

      for _, contestant := range contestants {
        contestantNParty := strings.Split(contestant, ":")

        cparl := ParliamentaryCandidate{
          Constituency: constituency,
          Party: strings.TrimSpace(contestantNParty[1]),
          Candidate: strings.TrimSpace(contestantNParty[0]),
        }

        err := pcd.Insert(cparl)
        if err != nil {
          panic("Failed to add Parliamentary candidate, " + cparl.Candidate)
        }
      }
    }
  }
}

func (api *API) GetParliamentaryByConstituency(c echo.Context) error {
  conn, err := ConnectMongo()
  defer conn.Close()

  if err != nil {
    c.Error(err)
    return nil
  }

  pcd := conn.DB("Election2016").C("Parliamentary")
    pipeline := []bson.M{
      bson.M{
        "$group": bson.M{
            "_id": "$constituency",
            "count": bson.M{ "$sum": 1 },
            "candidates": bson.M{
              "$push": bson.M {
                "candidate": "$candidate",
                "party": "$party",
                "candidateImage": "$candidateImage",
                "constituency": "$constituency",
              },
            },
        },
      },
      bson.M{
        "$project": bson.M{
            "constituency": "$_id",
            "candidates": 1,
            "count": 1,
        },
      },
  }

  var parliamentarians []Parliamentarians

  err = pcd.Pipe(pipeline).All(&parliamentarians)

  if err != nil {
    c.Error(err)
    return nil
  }

  c.JSON(200, parliamentarians)
  return nil
}

func (api *API) GetPresidentialCandidates(c echo.Context) error {
  //@todo:load db refs for results before send
  conn, err := ConnectMongo()
  defer conn.Close()

  if err != nil {
    c.Error(err)
    return nil
  }

  prec := conn.DB("Election2016").C("Presidential")
  
  var presidentialCandidates []PresidentialCandidate

  err = prec.Find(nil).All(&presidentialCandidates)
  if err != nil {
    c.Error(err)
    return nil
  }

  c.JSON(200, presidentialCandidates)
  return nil
}

func (api *API) SubmitResult(c echo.Context) error {
  var resultBody ResultArray
  err := c.Bind(&resultBody)

  if err != nil {
    c.Error(err)
    return nil
  }

  conn, err := ConnectMongo()
  defer conn.Close()

  if err != nil {
    c.Error(err)
    return nil
  }

  var sumConstVotes int
  var sumVotes int
  var tasks []Task
  for _, result := range resultBody.Data {
      if result.Type == "Presidential" {
        candidate := mgo.DBRef{
          Database: "Election2016",
          Id: result.Candidate,
          Collection: "Presidential",
        }

        var prescand PresidentialCandidate
        err := conn.FindRef(&candidate).One(&prescand)

        if err != nil {
          c.Error(err)
          return nil
        }

        pvotec := conn.DB("Election2016").C("PresidentialResults")
        count, err := pvotec.Find(bson.M{"constituency": result.Constituency, "candidate": candidate}).Count()

        if err != nil {
          c.Error(err)
          return nil
        }

        if count == 1 {
          c.Error(errors.New("Result already submitted for " + result.Constituency + " constituency"))
          return nil
        }

        // result hasn't been published for constituency..go ahead
        // get all results already submitted so that we can calculate percentage each candidate currently has
        var results []Result
        err = pvotec.Find(nil).All(&results)
        var sumCandVotes int
        if err != nil {
          c.Error(err)
          return nil
        }
        
        for _, res := range results {
          if res.Candidate.Id == prescand.Id {
            sumCandVotes += res.Votes.Count
          }

          if res.Constituency == result.Constituency {
            sumConstVotes += res.Votes.Count
          }
        }

        // add current candidate vote
        sumCandVotes += result.Votes.Count
        sumConstVotes += result.Votes.Count
        sumVotes += sumCandVotes

       var resultId = bson.NewObjectId()
        accumulatedResult := Result{
          Id: resultId,
          Type: result.Type,
          Candidate: candidate,
          Constituency: result.Constituency,
          Votes: Votes {
            Count: result.Votes.Count,
          },
        }

        task := Task{
          Candidate: prescand,
          SumCandVotes: sumCandVotes,
          Result: accumulatedResult,
        }
        
        tasks = append(tasks, task)
      } else {
        candidate := mgo.DBRef{
          Database: "Election2016",
          Id: result.Candidate,
          Collection: "Parliamentary",
        }

        var parlcand ParliamentaryCandidate
        err := conn.FindRef(&candidate).One(&parlcand)

        if err != nil {
          c.Error(err)
          return nil
        }

        parlc := conn.DB("Election2016").C("ParliamentaryResults")
        count, err := parlc.Find(bson.M{"constituency": result.Constituency, "candidate": candidate}).Count()

        if err != nil {
          c.Error(err)
          return nil
        }

        if count == 1 {
          c.Error(errors.New("Result already submitted for " + result.Constituency + " constituency"))
          return nil
        }

        // add current candidate vote
        sumConstVotes += result.Votes.Count

       var resultId = bson.NewObjectId()
        accumulatedResult := Result{
          Id: resultId,
          Type: result.Type,
          Candidate: candidate,
          Constituency: result.Constituency,
          Votes: Votes {
            Count: result.Votes.Count,
          },
        }

        task := Task{
          Candidate: parlcand,
          Result: accumulatedResult,
        }
        
        tasks = append(tasks, task)
      }
  }

  return CompleteResults(c, conn, sumVotes, sumConstVotes,  tasks)
  c.NoContent(200)
  return nil
}

func CompleteResults(c echo.Context, conn *mgo.Session, totalResults int, sumConstVotes int, tasks []Task) error {
  for _, task := range tasks {
    if reflect.TypeOf(task.Candidate).String() == "main.PresidentialCandidate" {
      pvotec := conn.DB("Election2016").C("PresidentialResults")
      prescand := task.Candidate.(PresidentialCandidate)
      resultToPush := task.Result

      percentageVote := (float64(resultToPush.Votes.Count) / float64(sumConstVotes)) * 100
      overallPercentageVote := (float64(task.SumCandVotes) / float64(totalResults)) * 100

      resultToPush.Votes.Percentage = percentageVote
      resultToPush.Votes.OverallPercentage = overallPercentageVote
      // save result to database
      err := pvotec.Insert(resultToPush)
      if err != nil {
        c.Error(err)
        return nil
      }

      resultRef := mgo.DBRef{
        Id: resultToPush.Id,
        Database: "Election2016",
        Collection: "PresidentialResults",
      }

      // save result to current PresidentialCandidate
      if resultToPush.Candidate.Id == prescand.Id {
        prescand.Results = append(prescand.Results, resultRef)
        err = prescand.Save()

        if err != nil {
          c.Error(err)
          return nil
        }
      }

      BroadCastToQueue("electionlive", resultToPush)
    } else {
      parlc := conn.DB("Election2016").C("ParliamentaryResults")

      parlcand := task.Candidate.(ParliamentaryCandidate)
      resultToPush := task.Result

      percentageVote := (float64(resultToPush.Votes.Count) / float64(sumConstVotes)) * 100
      resultToPush.Votes.Percentage = percentageVote
      // save result to database
      err := parlc.Insert(resultToPush)
      if err != nil {
        c.Error(err)
        return nil
      }

      resultRef := mgo.DBRef{
        Id: resultToPush.Id,
        Database: "Election2016",
        Collection: "ParliamentaryResults",
      }

      // save result to current PresidentialCandidate
      parlcand.Result = resultRef
      err = parlcand.Save()

      if err != nil {
        c.Error(err)
        return nil
      }

      // broadcast to listeners
      BroadCastToQueue("electionlive", resultToPush)
    }
  }
  c.NoContent(200)
  return nil
}

func (prec *PresidentialCandidate) Save() error {
  conn, err := ConnectMongo()
  if err != nil {
    return err
  }

  c := conn.DB("Election2016").C("Presidential")
  err = c.Update(bson.M{"_id": prec.Id}, prec)

  if err != nil {
    return err
  }

  return nil
}

func (parlc *ParliamentaryCandidate) Save() error {
  conn, err := ConnectMongo()
  if err != nil {
    return err
  }

  c := conn.DB("Election2016").C("Parliamentary")
  err = c.Update(bson.M{"_id": parlc.Id}, parlc)

  if err != nil {
    return err
  }

  return nil
}

// func GetConstituencies() []Constituency {

// }

// func ReportResult() error {

// }

// func SubmitCandidateImage(party string, type string) error {//general public can also submit candidate image

// }

// func SetPartyFlag() error {

// }