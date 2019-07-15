export default class Utils {
  static roundNumber(num, scale) {
    if (!("" + num).includes("e")) {
      return +(Math.round(<any>(num + "e+" + scale)) + "e-" + scale);
    } else {
      let arr = ("" + num).split("e");
      let sig = "";
      if (+arr[1] + scale > 0) {
        sig = "+";
      }
      return +(Math.round(<any>(+arr[0] + "e" + sig + (+arr[1] + scale))) + "e-" + scale);
    }
  }
}
