import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  //iconList to support asset icon based on asset type
  private iconList: any = {
    "AdapterService"            : "adapter_service.gif",
    "AdapterRuntimeNotification": "adapter_notification.gif",
    "broker-trigger"            : "ns_brokertrigger.gif",
    "ConnectionData"            : "ns_conn.gif",
    "Document Part Holder"      : "ffdictionary.png",
    "flow"                      : "ns_flow.GIF",
    "Flat File Schema"          : "ffnode.png",
    "graphqldescriptor"         : "graphql.png",
    "java"                      : "ns_java.gif",
    "jms-trigger"               : "ns_jmstrigger.gif",
    "mqtt-trigger"              : "mqtt.png",
    "map-service"               : "map-service.png",
    "odataService"              : "Odata.png",
    "record"                    : "DocumentType.gif",
    "restResource"              : "RestV2Resource.png",
    "restDescriptor"            : "restDescriptor.png",
    "spec"                      : "Specification.gif",
    "schema"                    : "schema.gif",
    "webServiceDescriptor"      : "webServiceDescriptor.png",
    "WebSocket"                 : "webSocket.png",
    "xsltservice"               : "ns_xsltservice.gif"
  }

  constructor() { }

  public getIcons(): any {
    return this.iconList;
  }
}
