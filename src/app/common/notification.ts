import { Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';
import {
  ToastyService,
  ToastyConfig,
  ToastOptions,
  ToastData
} from 'ng2-toasty';

export enum NotificationType {
  INFO,
  SUCCESS,
  WARNING,
  DANGER
}

@Injectable()
export class Notification {
  constructor(
    private translate: TranslateService,
    private zone: NgZone,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig
  ) {
    this.toastyConfig.theme = 'material';
  }

  editSuccess = () => {
    this.success('notify.EDIT_SUCCESS');
  };
  editError = (err?: any) => {
    if (!err) {
      this.error('notify.SERVER_ERROR');
    } else if (typeof err === 'string') {
      this.error(err, 'notify.EDIT_ERROR');
    } else if (typeof err === 'object') {
      this.error('errors.' + err.message, 'notify.EDIT_ERROR');
    } else {
      this.error('notify.EDIT_ERROR');
    }
  };
  addSuccess = () => {
    this.success('notify.ADD_SUCCESS');
  };
  updateSuccess = () => {
    this.success('Cập nhật thành công!');
  }
  approveSuccess = () => {
    this.success('Phê duyệt thành công!');
  }
  denySuccess = () => {
    this.success('Từ chối thành công!');
  }
  addError = (err?: any) => {
    if (!err) {
      this.error('notify.SERVER_ERROR');
    } else if (typeof err === 'string') {
      this.error(err, 'notify.ADD_ERROR');
    } else if (typeof err === 'object') {
      this.error('errors.' + err.message, 'notify.ADD_ERROR');
    } else {
      this.error('notify.ADD_ERROR');
    }
  };
  deleteSuccess = () => {
    this.success('notify.DELETE_SUCCESS');
  };
  deleteError = (err?: any) => {
    if (!err) {
      this.error('notify.SERVER_ERROR');
    } else if (typeof err === 'string') {
      this.error(err, 'notify.DELETE_ERROR');
    } else if (typeof err === 'object') {
      this.error('errors.' + err.message, 'notify.DELETE_ERROR');
    } else {
      this.error('notify.DELETE_ERROR');
    }
  };
  info = (message: string) => {
    this.translate.get(message).subscribe(data => {
      this.show(NotificationType.INFO, data);
    });
  };
  warning = (message: string) => {
    this.translate.get(message).subscribe(data => {
      this.show(NotificationType.WARNING, data);
    });
  };
  success = (message: string) => {
    this.translate.get(message).subscribe(data => {
      this.show(NotificationType.SUCCESS, data);
    });
  };
  error = (err: any, title?: string, messageDefault?: string) => {
    let message = err || 'notify.SERVER_ERROR';
    if (typeof err === 'object' && err) {
      message = 'errors.' + err.message;
    }
    if (!messageDefault) {
      messageDefault = 'notify.ERROR_UNDEFINED';
    }
    this.translate
      .get([message, messageDefault || ''])
      .subscribe((data: any) => {
        if (message === data[message] && messageDefault) {
          this.show(NotificationType.DANGER, data[messageDefault]);
        } else {
          this.show(NotificationType.DANGER, data[message]);
        }
      });
  };
  show = (notiType: NotificationType, message: string, title?: string) => {
    const types = ['info', 'success', 'warning', 'danger'];
    const type: string = types[notiType];
    const toastOptions: ToastOptions = {
      title: 'Thông báo',
      msg: message,
      showClose: true,
      timeout: 5000,
      theme: 'bootstrap',
      onAdd: (toast: ToastData) => {}
    };
    this.zone.run(() => {
      if (type === 'info') {
        this.toastyService.info(toastOptions);
      } else if (type === 'success') {
        this.toastyService.success(toastOptions);
      } else if (type === 'warning') {
        this.toastyService.warning(toastOptions);
      } else if (type === 'danger') {
        this.toastyService.error(toastOptions);
      }
    });
  };
}
