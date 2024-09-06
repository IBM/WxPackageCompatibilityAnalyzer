# WxPackageCompatibilityAnalyzer
The WxPackageCompatibilityAnalyzer is a powerful open-source tool designed to facilitate the migration of packages from source runtimes like webMethods Integration Server (IS) and Microservices Runtime (MSR) runtimes to target runtimes like webMethods.io Integration Cloud Runtime and webMethods Edge Runtime. It enables you to evaluate the dependencies and compatibility of the package and its resources before their migration. This helps you to understand whether the package will work straightaway or the amount of effort required to get it working.

## Features
* It offers **user friendly interface**.
* It allows you to **download the analysis reports** as CSV file.
* It's **easy to deploy** as a Docker container.
* It's **non-intrusive** to the existing installations.

## Getting Started

To use the WxPackageCompatibilityAnalyzer, jump to the [Deploy](https://github.com/IBM/WxPackageCompatibilityAnalyzer#deploy) and [Usage](https://github.com/IBM/WxPackageCompatibilityAnalyzer#usage) sections respectively and follow the steps.

## Contribute
This is an open-source project and requires community contributions to remain useful. Anyone can contribute to the project in the following ways:
* Extend Cloud Runtime and Edge Runtime rules in rules.json file.
* Add new features by extending or creating new APIs or implement bug fixes.
* Enhance UI for better user experience or implement bug fixes.

To make any contributions, 
1. Fork this repository.
2. Make your enhancements/ changes.
3. Create a Pull Request.
4. Finally, development team will evaluate the Pull Request and merge it to the source code.

### Required Skills
* webMethods Integration Developer
* UI Developement with Angular

### Setup Pre-requisites
* GitHub account
* webMethods MSR 10.15
* webMethods Designer 10.15
* Source Code Editor (example: Visual Studio Code)
* NodeJS 16.16.0
* Angular CLI 14.0.5

### Repository Structure
* **WxPackageCompatibilityAnalyzer-UI** is an Angular project with source code for the UI.
* **WxPackageCompatibilityAnalyzer** is webMethods MSR 10.15 package with source code.
* **docs** contains images and other blob files used in the README.md.
* **.gitignore** defines files to be excluded from being pushed to the respository.
* **Dockerfile** is a Docker file used by the users to build the Docker image of WxPackageCompatibilityAnalyzer during deployment.
* **README.md** is the primary readme file of this repository.
* **WxPackageCompatibilityAnalyzer-soapui-project.xml** is the SoapUI project file with all the APIs of WxPackageCompatibilityAnalyzer. It allows UI developers and testers to try out the APIs.

### Build Angular UI Project
Navigate to the project directory and run the following command.
```
npm run build
```
Copy the build files from 'dist' directory to the 'pub' directory of WxPackageCompatibilityAnalyzer package.

### Extend rules.json
rules.json is located in the 'resources' directory of WxPackageCompatibilityAnalyzer package.
It has the following two JSON arrays:
1. **references**: A list of webMethods Integration resources from built-in Wm packages that are incompatible with webMethods.io Integration Cloud Runtime, webMethods Edge Runtime, or both. Each object within the "references" array includes:
   * **name**: The namespace of the resource (e.g., "pub.cache.*", pub.remote:invoke).
   * **type**: The type of resource (e.g., "flow", "java"). [Refer here](https://github.com/IBM/WxPackageCompatibilityAnalyzer#webmethods-resource-name-and-type) for the list of webMethods Integration resources and their corresponding types.
   * **cloudruntime**: An object with the description of the resource incompatibility in webMethods.io Integration Cloud Runtime.
   * **edgeruntime**: An object with the description of the resource incompatibility in webMethods Edge Runtime.

2. **resources**: A list of webMethods Integration resource types that are incompatible with webMethods.io Integration Cloud Runtime, webMethods Edge Runtime, or both. Each object within the "resources" array includes:
   * **type**: The type of the resource (e.g., "restResource", "Flat File Schema"). [Refer here](https://github.com/IBM/WxPackageCompatibilityAnalyzer#webmethods-resource-name-and-type) for the list of webMethods Integration resources and their corresponding types.
   * **cloudruntime**: An object with the description of the resource incompatibility in webMethods.io Integration Cloud Runtime.
   * **edgeruntime**: An object with the description of the resource incompatibility in webMethods Edge Runtime.
  
Each "cloudruntime" and "edgeruntime" object contains the following properties:
* **severity**: The severity level of the issue, which can be
  * LOW: The resource will function, though there may be warnings or minor issues. These are not critical and do not significantly impact functionality. Refer to the "recommendation" property for guidance on achieving optimal performance.
  * MEDIUM: The resource may not function as expected, necessitating the use of an alternative resource or solution. Recommendations for alternatives are provided in the "recommendation" property.
  * HIGH: The resource will not function at all, and there is no available workaround or solution.
* **message**: A descriptive message detailing the issue.
* **recommendation**: Suggested actions to resolve or mitigate the issue.

## Deploy
To use the WxPackageCompatibilityAnalyzer, you need to deploy it first.

### Pre-requisites
* Machine with Docker installed
* Access to [webMethods Container Registry](https://containers.webmethods.io/)

### Deployment Scenarios
Before you proceed with the deployment of WxPackageCompatibilityAnalyzer, you must understand the three possible deployment scenarios based on the Target Runtime. These are explained below. 

**IMPORTANT:** Regardless of the deployment scenario you follow, WxPackageCompatibilityAnalyzer must be able to communicate with the Source Runtime atleast.

**1. No Target Runtime**

This deployment scenario is applicable in the following situations: 
* Target Runtime is not yet setup.
* Target Runtime is not reachable from WxPackageCompatibilityAnalyzer because of the network firewall.
* You do not want to analyze dependencies against a Target Runtime.

<img src="https://raw.githubusercontent.com/IBM/WxPackageCompatibilityAnalyzer/main/docs/images/deploymentScenario1.png" alt="Deployment scenario no target runtime" width="500"/>

**2. webMethods.io Integration Cloud Runtime is a Target Runtime**

This deployment scenario is applicable when your target runtime is webMethods.io Integration Cloud Runtime and you want to analyze the dependencies against it.

<img src="https://raw.githubusercontent.com/IBM/WxPackageCompatibilityAnalyzer/main/docs/images/deploymentScenario2.png" alt="Deployment scenario target cloud runtime" width="750"/>

**3. webMethods Edge Runtime is a Target Runtime**

This deployment scenario is applicable when your target runtime is webMethods Edge Runtime and you want to analyze the dependencies against it.

<img src="https://raw.githubusercontent.com/IBM/WxPackageCompatibilityAnalyzer/main/docs/images/deploymentScenario3.png" alt="Deployment scenario target edge runtime" width="750"/>

### Deployment Steps
Once you have identified your deployment scenario, follow the steps below:

#### Clone Repository
* Clone [WxPackageCompatibilityAnalyzer](https://github.com/IBM/WxPackageCompatibilityAnalyzer) Git repository on your host machine where you have got Docker environment setup.
```
git clone https://github.com/IBM/WxPackageCompatibilityAnalyzer.git
```
* Navigate to the directory
```
cd WxPackageCompatibilityAnalyzer
```

#### Pull webMethods Microservice Runtime (MSR) image
* Sign in to [webMethods Container Registry](https://containers.webmethods.io/user-profile) to get the 'user name' and 'user token'.
* Run the below command and login to the webMethods Container Registry.
```
docker login -u <user name> -p <user token> sagcr.azurecr.io
```
* Run the below command to pull the webMethods MSR 10.15 image.
```
docker pull sagcr.azurecr.io/webmethods-microservicesruntime:10.15
```

#### Build Docker image
```
docker build -t wx-pkgcomp-analyzer:1.0 .
```

#### Run Docker container
```
docker run -dp 5555:5555 wx-pkgcomp-analyzer:1.0
```

**NOTE:** If you encounter an error related to global variables mentioning the passman.cnf file, please update the path in lines 7 and 11 of the WxPackageCompatibilityAnalyzer/config/passman.cnf file with your MSR installation directory path inside the container.

## Usage
After the successful deployment, you can access the WxPackageCompatibilityAnalyzer at [http://{hostname}:5555/WxPackageCompatibilityAnalyzer/#](http://{hostname}:{port}/WxPackageCompatibilityAnalyzer/#).

Replace '{hostname}' with the hostname of the host machine. On prompt, provide the login credentials:
* Username: Administrator
* Password: manage

Navigate between the tabs on the left side of the screen:
### 1) Source Configuration
Allows you to configure the source runtime.

* **URL**: Enter the URL of the source runtime where the package (to be analyzed) is hosted. Example: http://localhost:5555/
* **Username**: Enter the username for the source runtime. Example: Administrator
* **Password**: Enter the password for the source runtime. Example: manage
* **Update**: Click this button to update the configuration and verify the connectivity to source runtime.

### 2) Analyze Dependencies
Allows you to analyze package dependencies and optionally, you can check their availability against the target runtime.

* **Source Package Name**: Select the package installed on the configured source runtime from the drop-down that needs to be analyzed.
* **Asset Type**: Choose between Resources and ACLs using the radio button based on whether you want to analyze resources (like flow-services, java services, etc.) or ACLs dependencies.
* **Configure Target Runtime** (Optional): Select this checkbox if you want to analyze resources or ACLs dependencies against a target runtime.
  * **Target Runtime URL**: Enter the URL of the target runtime. Example: http://localhost:5555/, if it's webMethods Edge Runtime. In case of webMethods.io Integration Cloud Runtime, refer to [WxPCACloudRuntimeClient](https://github.com/IBM/WxPCACloudRuntimeClient) to get the URL.
  * **Username**: Enter the username for the source runtime. Example: Administrator, if it's webMethods Edhe Runtime. In case of webMethods.io Integration Cloud Runtime, provide webMethods.io Integration tenant username.
  * **Password**: Enter the password for the source runtime. Example: manage.
* **Analyze**: Click this button to analyze the dependencies.

It'll generate a response listing all the dependencies for a package. In case of "Configure Target Runtime" selected, response will include availability status on the target runtime.

You can remove target runtime configuration anytime by unchecking **Configure Target Runtime** checkbox.

**NOTE:** If the "watt.server.ns.hideWmRoot" extended setting is set to "true" on target runtime, the availability status of WmRoot package resources will appear as "Unknown". To ensure accurate status reporting, set the extended setting to "false".

#### Download the analysis report
* Select **Download as CSV** option from the **Action** drop-down.
* Click on **Execute** button to download.

### 3) Analyze Compatibility
This tab allows you to check the compatibility of a package on the source runtime against another runtime.

* **Source Package Name**: Select the package name installed on the source runtime from the dropdown.
* **Target Runtime Type**: Choose the runtime type (Edge Runtime or Cloud Runtime) from the dropdown.
* **Analyze**: Click this button to analyze the compatibility.

It'll generate a detailed list of resources and references within the package that are incompatible with the selected target runtime, along with their severity, messages, and recommendations.

#### Download the analysis report
* Select **Download as CSV** option from the **Action** drop-down.
* Click on **Execute** button to download.


## Tested Runtime types & version
We've tested the package compatibility using this accelerator on following runtimes:
| Source Runtime | Target Runtime |
| ------------- | ------------- |
| 10.15 IS      | 11.x Edge Runtime       |
| 10.15 MSR      | 11.x Edge Runtime       |
| 10.15 IS      | Cloud Runtime |
| 10.15 MSR      | Cloud Runtime |


## Appendix

#### webMethods resource name and type
| Name                           | Type                          | 
| ------------------------------ | ----------------------------- |
| Adapter Connection             | ConnectionData                |
| Adapter Notification           | AdapterRuntimeNotification    |
| Adapter Service                | AdapterService                |
| Document Type                  | record                        |
| Flat File Dictionary           | Document Part Holder          |
| Flat File Schema               | Flat File Schema              |
| Flow Service                   | flow                          |
| GraphQL Descriptor             | graphqldescriptor             |
| Java Service                   | java                          |
| JMS Trigger                    | jms-trigger                   |
| Map Service                    | map-service                   |
| MQTT Trigger                   | mqtt-trigger                  |
| OData Service                  | odataService                  |
| REST API Descriptor            | restDescriptor                |
| REST Resource                  | restResource                  |
| Schema                         | schema                        |
| Specification                  | spec                          |
| Web Service Descriptor         | webServiceDescriptor          |
| webMethods Messaging Trigger   | broker-trigger                |
| WebSocket Endpoint             | WebSocket                     |
| XSLT Service                   | xsltservice                   |
