import { Injectable } from "@angular/core";
import { EditSettingsModel } from "@syncfusion/ej2-angular-grids";
import * as $ from 'jquery';

@Injectable()
export class Configs {
  // Language
  currentLang = localStorage.getItem("lang");
  height = () => {
      let heightGrid = 0;
      const windowHeight = window.innerHeight;
      const cardHeight = $('.card-content').innerHeight();
      heightGrid = windowHeight - cardHeight - 250;
      if (heightGrid < 220) {
        heightGrid = 220;
      }
      return heightGrid;
  }
  filterSettings = {
    type: "Menu",
    operators: {
      stringOperator: [
        // { value: "startsWith", text: "Bắt đầu bằng" },
        // { value: "endsWith", text: "Kết thúc bằng" },
        { value: "contains", text: "Chứa ký tự" }
      ],
      numberOperator: [
        { value: "Equal", text: "Bằng" },
        { value: "NotEqual", text: "Không bằng" },
        { value: "LessThan", text: "Nhỏ hơn" },
        { value: "LessThanOrEqual", text: "Nhỏ hơn hoặc bằng" },
        { value: "GreaterThan", text: "Lớn hơn" },
        { value: "GreaterThanOrEqual", text: "Lớn hơn hoặc bằng" }
      ],
      dateOperator: [
        { value: "Equal", text: "Bằng" },
        { value: "NotEqual", text: "Không bằng" },
        { value: "LessThan", text: "Nhỏ hơn" },
        { value: "LessThanOrEqual", text: "Nhỏ hơn hoặc bằng" },
        { value: "GreaterThan", text: "Lớn hơn" },
        { value: "GreaterThanOrEqual", text: "Lớn hơn hoặc bằng" }
      ],
      booleanOperator: [
        { value: "Equal", text: "Bằng" },
        { value: "NotEqual", text: "Không bằng" }
      ]
    }
  };
  public editSettings: EditSettingsModel = {
    allowEditing: false,
    allowAdding: false,
    allowDeleting: true,
    mode: "Dialog"
  };

  public editSettingsAllowAdd: EditSettingsModel = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: "Normal"
  };

  public wrapSettings = { wrapMode: "Both" };
  filter = { type: "CheckBox" };
  pageSettings: Object = {
    pageSizes: [10, 20, 50, 100],
    pageSize: 20,
    pageCount: 4
  };
  pageSettingsAll: Object = {
    pageSizes: [10, 20, 50, 100],
    pageSize: 20,
    pageCount: 4
  };
  treeGridPageSettings: Object = { pageSize: 10, pageCount: 4 };
  selectionSettings = {
    type: "Single ",
  };

  selectionSettingsNotCheck = {
    type: "Single",
    checkboxOnly: false
  };


  selectionNonCheckSettings = {
    type: "Multiple"
  };

  selectionSettingsCheck = {
    type: "Multiple",
    checkboxOnly: true
  };

  // Grid Translate
  languageGrid = {
    vi: {
      grid: {
        EmptyRecord: "Không có dữ liệu phù hợp.",
        EditOperationAlert: "Không chọn bản ghi nào để sửa!",
        Item: "Dòng bản ghi",
        Items: "Dòng bản ghi",
        FilterButton: "Tìm kiếm",
        ClearButton: "Hủy bỏ",
        EnterValue: "Tìm kiếm....",
        ChooseColumns: "Chọn cột hiển thị",
        SearchColumns: "Tìm kiếm cột",
        OKButton: "Đồng ý",
        CancelButton: "Hủy",
        SelectAll: "Chọn tất cả",
        Search: "Tìm kiếm",
        ChooseDate: "Chọn ngày",
        NoResult: "Không có dữ liệu phù hợp.",
        Matchs: "Không có dữ liệu phù hợp."
      },
      listbox: {
        noRecordsTemplate: "Không có dữ liệu phù hợp.",
        selectAllText: "Chọn tất cả",
        unSelectAllText: "Bỏ chọn tất cả"
      },
      dropdowns: {
        noRecordsTemplate: "Không có dữ liệu phù hợp.",
        actionFailureTemplate: "Không tải được dữ liệu."
      },
      pager: {
        currentPageInfo: "",
        pagerDropDown: "kết quả tìm kiếm",
        totalItemsInfo: "Tổng số bản ghi: {0}. Hiển thị",
        All: "Tất cả",
        pagerAllDropDown: "kết quả tìm kiếm"
      },
      datepicker: {
        today: "Hôm nay"
      }
    },
    en: {
      grid: {
        EmptyRecord: "Không có dữ liệu phù hợp.",
        EditOperationAlert: "Không chọn bản ghi nào để sửa!",
        Item: "Dòng bản ghi",
        Items: "Dòng bản ghi",
        FilterButton: "Tìm kiếm",
        ClearButton: "Hủy bỏ",
        EnterValue: "Tìm kiếm....",
        ChooseColumns: "Chọn cột hiển thị",
        SearchColumns: "Tìm kiếm cột",
        OKButton: "Đồng ý",
        CancelButton: "Hủy",
        SelectAll: "Chọn tất cả",
        Search: "Tìm kiếm",
        ChooseDate: "Chọn ngày",
        NoResult: "Không có dữ liệu phù hợp.",
        Matchs: "Không có dữ liệu phù hợp."
      },
      listbox: {
        noRecordsTemplate: "Không có dữ liệu phù hợp.",
        selectAllText: "Chọn tất cả",
        unSelectAllText: "Bỏ chọn tất cả",
        NoResult: "Không có dữ liệu phù hợp."

      },
      dropdowns: {
        noRecordsTemplate: "Không có dữ liệu phù hợp.",
        actionFailureTemplate: "Không tải được dữ liệu."
      },
      pager: {
        currentPageInfo: "",
        pagerDropDown: "kết quả tìm kiếm",
        totalItemsInfo: "Tổng số bản ghi: {0}. Hiển thị",
        All: "Tất cả",
        pagerAllDropDown: "kết quả tìm kiếm"
      },
      datepicker: {
        today: "Hôm nay"
      }
    }
  };
}
