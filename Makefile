all:	
	@ ./installs.sh
	@echo "installing dependencies for labadiweb"
	@cd ./labadiweb && make install
	@echo "installing dependencies for labadipics"
	@cd ./labadipics && glide install
	@echo "installing dependencies from labadihub"
	@cd ./labadihub && glide install