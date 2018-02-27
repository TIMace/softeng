SHELL=bash
SH=/usr/bin/env sh
BACKEND=./backend
FRONTEND=./frontend
DISTDIR=--output-path ~/dist
NGEXEC=./node_modules/@angular/cli/bin/ng
NGARGS=--prod --build-optimizer --no-delete-output-path

.ONESHELL:
all:install_pm2.o install_backend.o install_frontend.o start_rest_api.o build_angular.o
	@echo ""
	@echo "DONE"

test.o:
	@echo $(PWD)
	$(shell cd $(BACKEND); ls)
	@echo $(PWD)

install_pm2.o:
	@echo "**************************************************************************************************************"
	@echo "Installing and Updating PM2 Utility"
	@echo ""
	npm install -g pm2@latest
	pm2 update
	@echo ""
	@echo "Done Installing and Updating PM2 Utility"
	@echo "**************************************************************************************************************"
	@echo ""


install_backend.o:
	@echo "**************************************************************************************************************"
	@echo "Installing Node Modules for Backend"
	@echo ""
	cd $(BACKEND) && npm install
	@echo ""
	@echo "Done Installing Node Modules for Backend"
	@echo "**************************************************************************************************************"
	@echo ""

install_frontend.o:
	@echo "**************************************************************************************************************"
	@echo "Installing Node Modules for Frontend"
	@echo ""
	cd $(FRONTEND) && npm install
	@echo ""
	@echo "Done Installing Node Modules for Frontend"
	@echo "**************************************************************************************************************"
	@echo ""

start_rest_api.o:
	@echo "**************************************************************************************************************"
	@echo "Starting REST Api using PM2 for monitoring"
	@echo ""
	pm2 start processes.json
	@echo ""
	@echo "Done Starting REST Api using PM2 for monitoring"
	@echo "**************************************************************************************************************"
	@echo ""

build_angular.o:
	@echo "**************************************************************************************************************"
	@echo "Building Angular 4 Web App"
	@echo "This will take some time, please be patient"
	@echo ""
	cd $(FRONTEND) && $(NGEXEC) build $(NGARGS) $(DISTDIR)
	@echo ""
	@echo "Done Building Angular 4 Web App"
	@echo "**************************************************************************************************************"
