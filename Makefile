all:	
	@ ./installs.sh
	@cd ./labadiweb && make install
	@cd ./labadipics && glide install
	@cd ./labadihub && glide install