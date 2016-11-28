all:	
	@ ./installs.sh
	@echo "installing dependencies for labadiweb"
	@cd ./labadiweb && make install
	@echo "installing dependencies for labadipics"
	@cd ./labadipics && glide install
	@echo "installing dependencies from labadihub"
	@cd ./labadihub && glide install
	@echo "installing dependencies for labadicommon"
	@cd ./labadicommon && glide install
	@echo "installing dependencies for labadifeeds"
	@cd ./labadifeeds && glide install