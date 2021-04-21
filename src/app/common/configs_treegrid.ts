import { Injectable } from "@angular/core";
import { EditSettingsModel } from "@syncfusion/ej2-treegrid";

@Injectable()
export class ConfigTreeGrids {
  public editSettingsTreeGrid: EditSettingsModel = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: "Row"
  };
}
