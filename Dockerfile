FROM sagcr.azurecr.io/webmethods-microservicesruntime:10.15
ADD --chown=sagadmin ./WxPackageCompatibilityAnalyzer/resources/application.properties /opt/softwareag/IntegrationServer/application.properties
ADD --chown=sagadmin ./WxPackageCompatibilityAnalyzer/ /opt/softwareag/IntegrationServer/packages/WxPackageCompatibilityAnalyzer/
ADD --chown=sagadmin ./WxPackageCompatibilityAnalyzer-UI/dist/ /opt/softwareag/IntegrationServer/packages/WxPackageCompatibilityAnalyzer/pub/