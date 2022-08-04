class AjaxHandler {
  constructor(options) {
    this.options = options;
    this.form = this.options.form;
    this.btn = this.form ? this.form.querySelector('button[type="submit"]') : (this.options.btn ? this.options.btn : null);
  }

  onResponseSuccess(callback) {
    if (callback) {
      callback();
    }
  }

  onResponseFalse(callback) {
    if (callback) {
      callback();
    }
  }

  onAjaxHandlerProcess(callback) {
    if (callback) {
      callback();
    }
  }

  send(data, callbackSuccess, callbackFalse, callbackProcess) {
    // Event to modify data before ajax sending
    let beforeSubmitEvent;
    let xhr = new XMLHttpRequest();

    if (this.form) {
      beforeSubmitEvent = new CustomEvent('ajax:beforeSubmit', {
        'detail': {
          formData: data,
        }
      });

      this.form.dispatchEvent(beforeSubmitEvent);
    }

    xhr.open('POST', this.options.url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(beforeSubmitEvent ? beforeSubmitEvent.detail.formData : data);

    this._disableBtn();
    this._loadingBtn();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        setTimeout(() => {
          this._enableBtn();
          this._activateBtn();

          const response = JSON.parse(xhr.responseText);
          this.response = response;

          if (response.status === 'error') {
            this.onResponseFalse(callbackFalse);
          } else {
            this.onResponseSuccess(callbackSuccess);
          }
        }, 1000);
      }
    };
  }

  _disableBtn() {
    if (this.btn) {
      this.btn.setAttribute('disabled', 'disabled');
    }
  }

  _enableBtn() {
    if (this.btn) {
      this.btn.removeAttribute('disabled');
    }
  }

  _loadingBtn() {
    if (this.btn) {
      this.btn.classList.add('loading');
    }
  }

  _activateBtn() {
    if (this.btn) {
      this.btn.classList.remove('loading');
    }
  }
}

export default AjaxHandler;
