// Extend Chrome API for Manifest V3
declare namespace chrome {
  namespace action {
    interface OnClickedEvent {
      addListener(callback: () => void): void;
    }
    var onClicked: OnClickedEvent;
  }
}
