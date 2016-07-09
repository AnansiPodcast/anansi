import cocoaDialog from 'cocoa-dialog'
import Q from 'q'

class DialogController {

  static abstractMessage(icon, title, message, noCancel = true) {
    return cocoaDialog('ok-msgbox', {
      title: title,
      icon: icon,
      text: title,
      noCancel: noCancel,
      informativeText: message
    })
  }

  static error(title, message) {
    return DialogController.abstractMessage('caution', title, message)
  }

  static message() {
    return DialogController.abstractMessage('info', title, message)
  }

  static input(title, action) {
    const deferred = Q.defer();
    cocoaDialog('inputbox', {
      title: title,
      button1: action,
      button2: 'Cancel'
    }).then(result => {
      let data = result.split('\n')
      if(data[0] == '1')
        deferred.resolve(data[1]);
    })
    return deferred.promise
  }

}

module.exports = DialogController
