var f = /* @__PURE__ */ ((a) => (a.CODE_128 = "code_128", a.CODE_39 = "code_39", a.CODE_93 = "code_93", a.CODABAR = "codabar", a.EAN_8 = "ean_8", a.EAN_13 = "ean_13", a.ITF = "itf", a.UPC_A = "upc_a", a.UPC_E = "upc_e", a.QR_CODE = "qr_code", a.DATA_MATRIX = "data_matrix", a.AZTEC = "aztec", a.PDF417 = "pdf417", a))(f || {}), N = /* @__PURE__ */ ((a) => (a.AUTO = "auto", a.NATIVE = "native", a.ZBAR = "zbar", a))(N || {});
class lt {
  constructor(t) {
    if (this.formats = t, typeof window.BarcodeDetector > "u")
      throw new Error("Native BarcodeDetector is not supported in this browser");
    const s = this.mapToNativeFormats(t);
    this.detector = new window.BarcodeDetector({ formats: s });
  }
  mapToNativeFormats(t) {
    const s = {
      [f.CODE_128]: "code_128",
      [f.CODE_39]: "code_39",
      [f.CODE_93]: "code_93",
      [f.CODABAR]: "codabar",
      [f.EAN_8]: "ean_8",
      [f.EAN_13]: "ean_13",
      [f.ITF]: "itf",
      [f.UPC_A]: "upc_a",
      [f.UPC_E]: "upc_e",
      [f.QR_CODE]: "qr_code",
      [f.DATA_MATRIX]: "data_matrix",
      [f.AZTEC]: "aztec",
      [f.PDF417]: "pdf417"
    };
    return t.map((e) => s[e]);
  }
  async decode(t) {
    try {
      return (await this.detector.detect(t)).map((e) => ({
        rawValue: e.rawValue,
        format: e.format,
        boundingBox: e.boundingBox ? {
          x: e.boundingBox.x,
          y: e.boundingBox.y,
          width: e.boundingBox.width,
          height: e.boundingBox.height
        } : void 0
      }));
    } catch {
      return [];
    }
  }
  destroy() {
  }
}
function B(a, t, s, e) {
  return new (s || (s = Promise))(function(i, c) {
    function l(d) {
      try {
        b(e.next(d));
      } catch (u) {
        c(u);
      }
    }
    function p(d) {
      try {
        b(e.throw(d));
      } catch (u) {
        c(u);
      }
    }
    function b(d) {
      var u;
      d.done ? i(d.value) : (u = d.value, u instanceof s ? u : new s(function(m) {
        m(u);
      })).then(l, p);
    }
    b((e = e.apply(a, [])).next());
  });
}
var _, gt = (_ = import.meta.url, async function(a = {}) {
  var t, s, e = a;
  e.ready = new Promise((n, o) => {
    t = n, s = o;
  });
  var i, c, l, p = Object.assign({}, e), b = typeof window == "object", d = typeof importScripts == "function", u = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", m = "";
  if (u) {
    const { createRequire: n } = await Promise.resolve().then(() => kt);
    var g = n(import.meta.url), I = g("fs"), k = g("path");
    m = d ? k.dirname(m) + "/" : g("url").fileURLToPath(new URL("data:text/javascript;base64,ZnVuY3Rpb24gdCh0LGUsbixyKXtyZXR1cm4gbmV3KG58fChuPVByb21pc2UpKSgoZnVuY3Rpb24oaSxvKXtmdW5jdGlvbiBzKHQpe3RyeXtjKHIubmV4dCh0KSl9Y2F0Y2godCl7byh0KX19ZnVuY3Rpb24gYSh0KXt0cnl7YyhyLnRocm93KHQpKX1jYXRjaCh0KXtvKHQpfX1mdW5jdGlvbiBjKHQpe3ZhciBlO3QuZG9uZT9pKHQudmFsdWUpOihlPXQudmFsdWUsZSBpbnN0YW5jZW9mIG4/ZTpuZXcgbigoZnVuY3Rpb24odCl7dChlKX0pKSkudGhlbihzLGEpfWMoKHI9ci5hcHBseSh0LGV8fFtdKSkubmV4dCgpKX0pKX0iZnVuY3Rpb24iPT10eXBlb2YgU3VwcHJlc3NlZEVycm9yJiZTdXBwcmVzc2VkRXJyb3I7dmFyIGUsbj0oZT1pbXBvcnQubWV0YS51cmwsYXN5bmMgZnVuY3Rpb24odD17fSl7dmFyIG4scixpPXQ7aS5yZWFkeT1uZXcgUHJvbWlzZSgoKHQsZSk9PntuPXQscj1lfSkpO3ZhciBvLHMsYSxjPU9iamVjdC5hc3NpZ24oe30saSksXz0ib2JqZWN0Ij09dHlwZW9mIHdpbmRvdyx1PSJmdW5jdGlvbiI9PXR5cGVvZiBpbXBvcnRTY3JpcHRzLEE9Im9iamVjdCI9PXR5cGVvZiBwcm9jZXNzJiYib2JqZWN0Ij09dHlwZW9mIHByb2Nlc3MudmVyc2lvbnMmJiJzdHJpbmciPT10eXBlb2YgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlLGY9IiI7aWYoQSl7Y29uc3R7Y3JlYXRlUmVxdWlyZTp0fT1hd2FpdCBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgoKT0+ZykpO3ZhciBoPXQoaW1wb3J0Lm1ldGEudXJsKSxsPWgoImZzIiksUj1oKCJwYXRoIik7Zj11P1IuZGlybmFtZShmKSsiLyI6aCgidXJsIikuZmlsZVVSTFRvUGF0aChuZXcgVVJMKCIuLyIsaW1wb3J0Lm1ldGEudXJsKSksbz0odCxlKT0+KHQ9VSh0KT9uZXcgVVJMKHQpOlIubm9ybWFsaXplKHQpLGwucmVhZEZpbGVTeW5jKHQsZT92b2lkIDA6InV0ZjgiKSksYT10PT57dmFyIGU9byh0LCEwKTtyZXR1cm4gZS5idWZmZXJ8fChlPW5ldyBVaW50OEFycmF5KGUpKSxlfSxzPSh0LGUsbixyPSEwKT0+e3Q9VSh0KT9uZXcgVVJMKHQpOlIubm9ybWFsaXplKHQpLGwucmVhZEZpbGUodCxyP3ZvaWQgMDoidXRmOCIsKCh0LGkpPT57dD9uKHQpOmUocj9pLmJ1ZmZlcjppKX0pKX0sIWkudGhpc1Byb2dyYW0mJnByb2Nlc3MuYXJndi5sZW5ndGg+MSYmcHJvY2Vzcy5hcmd2WzFdLnJlcGxhY2UoL1xcL2csIi8iKSxwcm9jZXNzLmFyZ3Yuc2xpY2UoMiksaS5pbnNwZWN0PSgpPT4iW0Vtc2NyaXB0ZW4gTW9kdWxlIG9iamVjdF0ifWVsc2UoX3x8dSkmJih1P2Y9c2VsZi5sb2NhdGlvbi5ocmVmOiJ1bmRlZmluZWQiIT10eXBlb2YgZG9jdW1lbnQmJmRvY3VtZW50LmN1cnJlbnRTY3JpcHQmJihmPWRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjKSxlJiYoZj1lKSxmPTAhPT1mLmluZGV4T2YoImJsb2I6Iik/Zi5zdWJzdHIoMCxmLnJlcGxhY2UoL1s/I10uKi8sIiIpLmxhc3RJbmRleE9mKCIvIikrMSk6IiIsbz10PT57dmFyIGU9bmV3IFhNTEh0dHBSZXF1ZXN0O3JldHVybiBlLm9wZW4oIkdFVCIsdCwhMSksZS5zZW5kKG51bGwpLGUucmVzcG9uc2VUZXh0fSx1JiYoYT10PT57dmFyIGU9bmV3IFhNTEh0dHBSZXF1ZXN0O3JldHVybiBlLm9wZW4oIkdFVCIsdCwhMSksZS5yZXNwb25zZVR5cGU9ImFycmF5YnVmZmVyIixlLnNlbmQobnVsbCksbmV3IFVpbnQ4QXJyYXkoZS5yZXNwb25zZSl9KSxzPSh0LGUsbik9Pnt2YXIgcj1uZXcgWE1MSHR0cFJlcXVlc3Q7ci5vcGVuKCJHRVQiLHQsITApLHIucmVzcG9uc2VUeXBlPSJhcnJheWJ1ZmZlciIsci5vbmxvYWQ9KCk9PnsyMDA9PXIuc3RhdHVzfHwwPT1yLnN0YXR1cyYmci5yZXNwb25zZT9lKHIucmVzcG9uc2UpOm4oKX0sci5vbmVycm9yPW4sci5zZW5kKG51bGwpfSk7dmFyIGQsbSxwLHk9aS5wcmludHx8Y29uc29sZS5sb2cuYmluZChjb25zb2xlKSxCPWkucHJpbnRFcnJ8fGNvbnNvbGUuZXJyb3IuYmluZChjb25zb2xlKTtPYmplY3QuYXNzaWduKGksYyksYz1udWxsLGkuYXJndW1lbnRzJiZpLmFyZ3VtZW50cyxpLnRoaXNQcm9ncmFtJiZpLnRoaXNQcm9ncmFtLGkucXVpdCYmaS5xdWl0LGkud2FzbUJpbmFyeSYmKGQ9aS53YXNtQmluYXJ5KSxpLm5vRXhpdFJ1bnRpbWUsIm9iamVjdCIhPXR5cGVvZiBXZWJBc3NlbWJseSYmUCgibm8gbmF0aXZlIHdhc20gc3VwcG9ydCBkZXRlY3RlZCIpO3ZhciBFLEksWj0hMTtmdW5jdGlvbiB2KCl7dmFyIHQ9bS5idWZmZXI7aS5IRUFQOD1uZXcgSW50OEFycmF5KHQpLGkuSEVBUDE2PW5ldyBJbnQxNkFycmF5KHQpLGkuSEVBUDMyPW5ldyBJbnQzMkFycmF5KHQpLGkuSEVBUFU4PUU9bmV3IFVpbnQ4QXJyYXkodCksaS5IRUFQVTE2PW5ldyBVaW50MTZBcnJheSh0KSxpLkhFQVBVMzI9ST1uZXcgVWludDMyQXJyYXkodCksaS5IRUFQRjMyPW5ldyBGbG9hdDMyQXJyYXkodCksaS5IRUFQRjY0PW5ldyBGbG9hdDY0QXJyYXkodCl9dmFyIGI9W10sQz1bXSxOPVtdLFM9MCx3PW51bGw7ZnVuY3Rpb24gUCh0KXtpLm9uQWJvcnQmJmkub25BYm9ydCh0KSxCKHQ9IkFib3J0ZWQoIit0KyIpIiksWj0hMCx0Kz0iLiBCdWlsZCB3aXRoIC1zQVNTRVJUSU9OUyBmb3IgbW9yZSBpbmZvLiI7dmFyIGU9bmV3IFdlYkFzc2VtYmx5LlJ1bnRpbWVFcnJvcih0KTt0aHJvdyByKGUpLGV9dmFyIFQsTyxEPSJkYXRhOmFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbTtiYXNlNjQsIjtmdW5jdGlvbiBGKHQpe3JldHVybiB0LnN0YXJ0c1dpdGgoRCl9ZnVuY3Rpb24gVSh0KXtyZXR1cm4gdC5zdGFydHNXaXRoKCJmaWxlOi8vIil9ZnVuY3Rpb24gSCh0KXtpZih0PT1UJiZkKXJldHVybiBuZXcgVWludDhBcnJheShkKTtpZihhKXJldHVybiBhKHQpO3Rocm93ImJvdGggYXN5bmMgYW5kIHN5bmMgZmV0Y2hpbmcgb2YgdGhlIHdhc20gZmFpbGVkIn1mdW5jdGlvbiBHKHQsZSxuKXtyZXR1cm4gZnVuY3Rpb24odCl7aWYoIWQmJihffHx1KSl7aWYoImZ1bmN0aW9uIj09dHlwZW9mIGZldGNoJiYhVSh0KSlyZXR1cm4gZmV0Y2godCx7Y3JlZGVudGlhbHM6InNhbWUtb3JpZ2luIn0pLnRoZW4oKGU9PntpZighZS5vayl0aHJvdyJmYWlsZWQgdG8gbG9hZCB3YXNtIGJpbmFyeSBmaWxlIGF0ICciK3QrIiciO3JldHVybiBlLmFycmF5QnVmZmVyKCl9KSkuY2F0Y2goKCgpPT5IKHQpKSk7aWYocylyZXR1cm4gbmV3IFByb21pc2UoKChlLG4pPT57cyh0LCh0PT5lKG5ldyBVaW50OEFycmF5KHQpKSksbil9KSl9cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCgpPT5IKHQpKSl9KHQpLnRoZW4oKHQ9PldlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKHQsZSkpKS50aGVuKCh0PT50KSkudGhlbihuLCh0PT57QigiZmFpbGVkIHRvIGFzeW5jaHJvbm91c2x5IHByZXBhcmUgd2FzbTogIit0KSxQKHQpfSkpfWkubG9jYXRlRmlsZT9GKFQ9InpiYXIud2FzbSIpfHwoTz1ULFQ9aS5sb2NhdGVGaWxlP2kubG9jYXRlRmlsZShPLGYpOmYrTyk6VD1uZXcgVVJMKCJ6YmFyLndhc20iLGltcG9ydC5tZXRhLnVybCkuaHJlZjt2YXIgTCxNPXQ9Pntmb3IoO3QubGVuZ3RoPjA7KXQuc2hpZnQoKShpKX0seD10PT57dmFyIGU9dC1tLmJ1ZmZlci5ieXRlTGVuZ3RoKzY1NTM1Pj4+MTY7dHJ5e3JldHVybiBtLmdyb3coZSksdigpLDF9Y2F0Y2godCl7fX0sVz0idW5kZWZpbmVkIiE9dHlwZW9mIFRleHREZWNvZGVyP25ldyBUZXh0RGVjb2RlcigidXRmOCIpOnZvaWQgMCxrPVtudWxsLFtdLFtdXSxZPSh0LGUpPT57dmFyIG49a1t0XTswPT09ZXx8MTA9PT1lPygoMT09PXQ/eTpCKSgoKHQsZSxuKT0+e2Zvcih2YXIgcj1lK24saT1lO3RbaV0mJiEoaT49cik7KSsraTtpZihpLWU+MTYmJnQuYnVmZmVyJiZXKXJldHVybiBXLmRlY29kZSh0LnN1YmFycmF5KGUsaSkpO2Zvcih2YXIgbz0iIjtlPGk7KXt2YXIgcz10W2UrK107aWYoMTI4JnMpe3ZhciBhPTYzJnRbZSsrXTtpZigxOTIhPSgyMjQmcykpe3ZhciBjPTYzJnRbZSsrXTtpZigocz0yMjQ9PSgyNDAmcyk/KDE1JnMpPDwxMnxhPDw2fGM6KDcmcyk8PDE4fGE8PDEyfGM8PDZ8NjMmdFtlKytdKTw2NTUzNilvKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHMpO2Vsc2V7dmFyIF89cy02NTUzNjtvKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDU1Mjk2fF8+PjEwLDU2MzIwfDEwMjMmXyl9fWVsc2Ugbys9U3RyaW5nLmZyb21DaGFyQ29kZSgoMzEmcyk8PDZ8YSl9ZWxzZSBvKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHMpfXJldHVybiBvfSkobiwwKSksbi5sZW5ndGg9MCk6bi5wdXNoKGUpfSxqPXtkOigpPT4hMCxlOmZ1bmN0aW9uKCl7cmV0dXJuIERhdGUubm93KCl9LGM6dD0+e3ZhciBlPUUubGVuZ3RoLG49MjE0NzQ4MzY0ODtpZigodD4+Pj0wKT5uKXJldHVybiExO2Zvcih2YXIgcixpLG89MTtvPD00O28qPTIpe3ZhciBzPWUqKDErLjIvbyk7cz1NYXRoLm1pbihzLHQrMTAwNjYzMjk2KTt2YXIgYT1NYXRoLm1pbihuLChyPU1hdGgubWF4KHQscykpKygoaT02NTUzNiktciVpKSVpKTtpZih4KGEpKXJldHVybiEwfXJldHVybiExfSxmOnQ9PjUyLGI6ZnVuY3Rpb24odCxlLG4scixpKXtyZXR1cm4gNzB9LGE6KHQsZSxuLHIpPT57Zm9yKHZhciBpPTAsbz0wO288bjtvKyspe3ZhciBzPUlbZT4+Ml0sYT1JW2UrND4+Ml07ZSs9ODtmb3IodmFyIGM9MDtjPGE7YysrKVkodCxFW3MrY10pO2krPWF9cmV0dXJuIElbcj4+Ml09aSwwfX07ZnVuY3Rpb24gcSgpe2Z1bmN0aW9uIHQoKXtMfHwoTD0hMCxpLmNhbGxlZFJ1bj0hMCxafHwoTShDKSxuKGkpLGkub25SdW50aW1lSW5pdGlhbGl6ZWQmJmkub25SdW50aW1lSW5pdGlhbGl6ZWQoKSxmdW5jdGlvbigpe2lmKGkucG9zdFJ1bilmb3IoImZ1bmN0aW9uIj09dHlwZW9mIGkucG9zdFJ1biYmKGkucG9zdFJ1bj1baS5wb3N0UnVuXSk7aS5wb3N0UnVuLmxlbmd0aDspdD1pLnBvc3RSdW4uc2hpZnQoKSxOLnVuc2hpZnQodCk7dmFyIHQ7TShOKX0oKSkpfVM+MHx8KGZ1bmN0aW9uKCl7aWYoaS5wcmVSdW4pZm9yKCJmdW5jdGlvbiI9PXR5cGVvZiBpLnByZVJ1biYmKGkucHJlUnVuPVtpLnByZVJ1bl0pO2kucHJlUnVuLmxlbmd0aDspdD1pLnByZVJ1bi5zaGlmdCgpLGIudW5zaGlmdCh0KTt2YXIgdDtNKGIpfSgpLFM+MHx8KGkuc2V0U3RhdHVzPyhpLnNldFN0YXR1cygiUnVubmluZy4uLiIpLHNldFRpbWVvdXQoKGZ1bmN0aW9uKCl7c2V0VGltZW91dCgoZnVuY3Rpb24oKXtpLnNldFN0YXR1cygiIil9KSwxKSx0KCl9KSwxKSk6dCgpKSl9aWYoZnVuY3Rpb24oKXt2YXIgdCxlLG4sbyxzPXthOmp9O2Z1bmN0aW9uIGEodCxlKXt2YXIgbixyPXQuZXhwb3J0cztyZXR1cm4gbT0ocD1yKS5nLHYoKSxwLnMsbj1wLmgsQy51bnNoaWZ0KG4pLGZ1bmN0aW9uKHQpe2lmKFMtLSxpLm1vbml0b3JSdW5EZXBlbmRlbmNpZXMmJmkubW9uaXRvclJ1bkRlcGVuZGVuY2llcyhTKSwwPT1TJiZ3KXt2YXIgZT13O3c9bnVsbCxlKCl9fSgpLHJ9aWYoUysrLGkubW9uaXRvclJ1bkRlcGVuZGVuY2llcyYmaS5tb25pdG9yUnVuRGVwZW5kZW5jaWVzKFMpLGkuaW5zdGFudGlhdGVXYXNtKXRyeXtyZXR1cm4gaS5pbnN0YW50aWF0ZVdhc20ocyxhKX1jYXRjaCh0KXtCKCJNb2R1bGUuaW5zdGFudGlhdGVXYXNtIGNhbGxiYWNrIGZhaWxlZCB3aXRoIGVycm9yOiAiK3QpLHIodCl9KHQ9ZCxlPVQsbj1zLG89ZnVuY3Rpb24odCl7YSh0Lmluc3RhbmNlKX0sdHx8ImZ1bmN0aW9uIiE9dHlwZW9mIFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nfHxGKGUpfHxVKGUpfHxBfHwiZnVuY3Rpb24iIT10eXBlb2YgZmV0Y2g/RyhlLG4sbyk6ZmV0Y2goZSx7Y3JlZGVudGlhbHM6InNhbWUtb3JpZ2luIn0pLnRoZW4oKHQ9PldlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKHQsbikudGhlbihvLChmdW5jdGlvbih0KXtyZXR1cm4gQigid2FzbSBzdHJlYW1pbmcgY29tcGlsZSBmYWlsZWQ6ICIrdCksQigiZmFsbGluZyBiYWNrIHRvIEFycmF5QnVmZmVyIGluc3RhbnRpYXRpb24iKSxHKGUsbixvKX0pKSkpKS5jYXRjaChyKX0oKSxpLl9JbWFnZVNjYW5uZXJfY3JlYXRlPSgpPT4oaS5fSW1hZ2VTY2FubmVyX2NyZWF0ZT1wLmkpKCksaS5fSW1hZ2VTY2FubmVyX2Rlc3Rvcnk9dD0+KGkuX0ltYWdlU2Nhbm5lcl9kZXN0b3J5PXAuaikodCksaS5fSW1hZ2VTY2FubmVyX3NldF9jb25maWc9KHQsZSxuLHIpPT4oaS5fSW1hZ2VTY2FubmVyX3NldF9jb25maWc9cC5rKSh0LGUsbixyKSxpLl9JbWFnZVNjYW5uZXJfZW5hYmxlX2NhY2hlPSh0LGUpPT4oaS5fSW1hZ2VTY2FubmVyX2VuYWJsZV9jYWNoZT1wLmwpKHQsZSksaS5fSW1hZ2VTY2FubmVyX3JlY3ljbGVfaW1hZ2U9KHQsZSk9PihpLl9JbWFnZVNjYW5uZXJfcmVjeWNsZV9pbWFnZT1wLm0pKHQsZSksaS5fSW1hZ2VTY2FubmVyX2dldF9yZXN1bHRzPXQ9PihpLl9JbWFnZVNjYW5uZXJfZ2V0X3Jlc3VsdHM9cC5uKSh0KSxpLl9JbWFnZVNjYW5uZXJfc2Nhbj0odCxlKT0+KGkuX0ltYWdlU2Nhbm5lcl9zY2FuPXAubykodCxlKSxpLl9JbWFnZV9jcmVhdGU9KHQsZSxuLHIsbyxzKT0+KGkuX0ltYWdlX2NyZWF0ZT1wLnApKHQsZSxuLHIsbyxzKSxpLl9JbWFnZV9kZXN0b3J5PXQ9PihpLl9JbWFnZV9kZXN0b3J5PXAucSkodCksaS5fSW1hZ2VfZ2V0X3N5bWJvbHM9dD0+KGkuX0ltYWdlX2dldF9zeW1ib2xzPXAucikodCksaS5fZnJlZT10PT4oaS5fZnJlZT1wLnQpKHQpLGkuX21hbGxvYz10PT4oaS5fbWFsbG9jPXAudSkodCksdz1mdW5jdGlvbiB0KCl7THx8cSgpLEx8fCh3PXQpfSxpLnByZUluaXQpZm9yKCJmdW5jdGlvbiI9PXR5cGVvZiBpLnByZUluaXQmJihpLnByZUluaXQ9W2kucHJlSW5pdF0pO2kucHJlSW5pdC5sZW5ndGg+MDspaS5wcmVJbml0LnBvcCgpKCk7cmV0dXJuIHEoKSx0LnJlYWR5fSk7bGV0IHI7ZnVuY3Rpb24gaShlPXt9KXtyPWZ1bmN0aW9uKCl7cmV0dXJuIHQodGhpcyx2b2lkIDAsdm9pZCAwLChmdW5jdGlvbiooKXtjb25zdCB0PXlpZWxkIG4oZSk7aWYodClyZXR1cm4gdDt0aHJvdyBFcnJvcigiV0FTTSB3YXMgbm90IGxvYWRlZCIpfSkpfSgpfWZ1bmN0aW9uIG8oKXtyZXR1cm4gdCh0aGlzLHZvaWQgMCx2b2lkIDAsKGZ1bmN0aW9uKigpe3JldHVybiByfHxpKCkseWllbGQgcn0pKX12YXIgcyxhLGM7IWZ1bmN0aW9uKHQpe3RbdC5aQkFSX05PTkU9MF09IlpCQVJfTk9ORSIsdFt0LlpCQVJfUEFSVElBTD0xXT0iWkJBUl9QQVJUSUFMIix0W3QuWkJBUl9FQU4yPTJdPSJaQkFSX0VBTjIiLHRbdC5aQkFSX0VBTjU9NV09IlpCQVJfRUFONSIsdFt0LlpCQVJfRUFOOD04XT0iWkJBUl9FQU44Iix0W3QuWkJBUl9VUENFPTldPSJaQkFSX1VQQ0UiLHRbdC5aQkFSX0lTQk4xMD0xMF09IlpCQVJfSVNCTjEwIix0W3QuWkJBUl9VUENBPTEyXT0iWkJBUl9VUENBIix0W3QuWkJBUl9FQU4xMz0xM109IlpCQVJfRUFOMTMiLHRbdC5aQkFSX0lTQk4xMz0xNF09IlpCQVJfSVNCTjEzIix0W3QuWkJBUl9DT01QT1NJVEU9MTVdPSJaQkFSX0NPTVBPU0lURSIsdFt0LlpCQVJfSTI1PTI1XT0iWkJBUl9JMjUiLHRbdC5aQkFSX0RBVEFCQVI9MzRdPSJaQkFSX0RBVEFCQVIiLHRbdC5aQkFSX0RBVEFCQVJfRVhQPTM1XT0iWkJBUl9EQVRBQkFSX0VYUCIsdFt0LlpCQVJfQ09EQUJBUj0zOF09IlpCQVJfQ09EQUJBUiIsdFt0LlpCQVJfQ09ERTM5PTM5XT0iWkJBUl9DT0RFMzkiLHRbdC5aQkFSX1BERjQxNz01N109IlpCQVJfUERGNDE3Iix0W3QuWkJBUl9RUkNPREU9NjRdPSJaQkFSX1FSQ09ERSIsdFt0LlpCQVJfU1FDT0RFPTgwXT0iWkJBUl9TUUNPREUiLHRbdC5aQkFSX0NPREU5Mz05M109IlpCQVJfQ09ERTkzIix0W3QuWkJBUl9DT0RFMTI4PTEyOF09IlpCQVJfQ09ERTEyOCIsdFt0LlpCQVJfU1lNQk9MPTI1NV09IlpCQVJfU1lNQk9MIix0W3QuWkJBUl9BRERPTjI9NTEyXT0iWkJBUl9BRERPTjIiLHRbdC5aQkFSX0FERE9ONT0xMjgwXT0iWkJBUl9BRERPTjUiLHRbdC5aQkFSX0FERE9OPTE3OTJdPSJaQkFSX0FERE9OIn0oc3x8KHM9e30pKSxmdW5jdGlvbih0KXt0W3QuWkJBUl9DRkdfRU5BQkxFPTBdPSJaQkFSX0NGR19FTkFCTEUiLHRbdC5aQkFSX0NGR19BRERfQ0hFQ0s9MV09IlpCQVJfQ0ZHX0FERF9DSEVDSyIsdFt0LlpCQVJfQ0ZHX0VNSVRfQ0hFQ0s9Ml09IlpCQVJfQ0ZHX0VNSVRfQ0hFQ0siLHRbdC5aQkFSX0NGR19BU0NJST0zXT0iWkJBUl9DRkdfQVNDSUkiLHRbdC5aQkFSX0NGR19CSU5BUlk9NF09IlpCQVJfQ0ZHX0JJTkFSWSIsdFt0LlpCQVJfQ0ZHX05VTT01XT0iWkJBUl9DRkdfTlVNIix0W3QuWkJBUl9DRkdfTUlOX0xFTj0zMl09IlpCQVJfQ0ZHX01JTl9MRU4iLHRbdC5aQkFSX0NGR19NQVhfTEVOPTMzXT0iWkJBUl9DRkdfTUFYX0xFTiIsdFt0LlpCQVJfQ0ZHX1VOQ0VSVEFJTlRZPTY0XT0iWkJBUl9DRkdfVU5DRVJUQUlOVFkiLHRbdC5aQkFSX0NGR19QT1NJVElPTj0xMjhdPSJaQkFSX0NGR19QT1NJVElPTiIsdFt0LlpCQVJfQ0ZHX1RFU1RfSU5WRVJURUQ9MTI5XT0iWkJBUl9DRkdfVEVTVF9JTlZFUlRFRCIsdFt0LlpCQVJfQ0ZHX1hfREVOU0lUWT0yNTZdPSJaQkFSX0NGR19YX0RFTlNJVFkiLHRbdC5aQkFSX0NGR19ZX0RFTlNJVFk9MjU3XT0iWkJBUl9DRkdfWV9ERU5TSVRZIn0oYXx8KGE9e30pKSxmdW5jdGlvbih0KXt0W3QuWkJBUl9PUklFTlRfVU5LTk9XTj0tMV09IlpCQVJfT1JJRU5UX1VOS05PV04iLHRbdC5aQkFSX09SSUVOVF9VUD0wXT0iWkJBUl9PUklFTlRfVVAiLHRbdC5aQkFSX09SSUVOVF9SSUdIVD0xXT0iWkJBUl9PUklFTlRfUklHSFQiLHRbdC5aQkFSX09SSUVOVF9ET1dOPTJdPSJaQkFSX09SSUVOVF9ET1dOIix0W3QuWkJBUl9PUklFTlRfTEVGVD0zXT0iWkJBUl9PUklFTlRfTEVGVCJ9KGN8fChjPXt9KSk7Y2xhc3MgX3tjb25zdHJ1Y3Rvcih0LGUpe3RoaXMucHRyPXQsdGhpcy5pbnN0PWV9Y2hlY2tBbGl2ZSgpe2lmKCF0aGlzLnB0cil0aHJvdyBFcnJvcigiQ2FsbCBhZnRlciBkZXN0cm95ZWQiKX1nZXRQb2ludGVyKCl7cmV0dXJuIHRoaXMuY2hlY2tBbGl2ZSgpLHRoaXMucHRyfX1jbGFzcyB1e2NvbnN0cnVjdG9yKHQsZSl7dGhpcy5wdHI9dCx0aGlzLnB0cjMyPXQ+PjIsdGhpcy5idWY9ZSx0aGlzLkhFQVA4PW5ldyBJbnQ4QXJyYXkoZSksdGhpcy5IRUFQVTMyPW5ldyBVaW50MzJBcnJheShlKSx0aGlzLkhFQVAzMj1uZXcgSW50MzJBcnJheShlKX19Y2xhc3MgQSBleHRlbmRzIHV7Z2V0IHR5cGUoKXtyZXR1cm4gdGhpcy5IRUFQVTMyW3RoaXMucHRyMzJdfWdldCBkYXRhKCl7Y29uc3QgdD10aGlzLkhFQVBVMzJbdGhpcy5wdHIzMis0XSxlPXRoaXMuSEVBUFUzMlt0aGlzLnB0cjMyKzVdO3JldHVybiBJbnQ4QXJyYXkuZnJvbSh0aGlzLkhFQVA4LnN1YmFycmF5KGUsZSt0KSl9Z2V0IHBvaW50cygpe2NvbnN0IHQ9dGhpcy5IRUFQVTMyW3RoaXMucHRyMzIrN10sZT10aGlzLkhFQVBVMzJbdGhpcy5wdHIzMis4XT4+MixuPVtdO2ZvcihsZXQgcj0wO3I8dDsrK3Ipe2NvbnN0IHQ9dGhpcy5IRUFQMzJbZSsyKnJdLGk9dGhpcy5IRUFQMzJbZSsyKnIrMV07bi5wdXNoKHt4OnQseTppfSl9cmV0dXJuIG59Z2V0IG9yaWVudGF0aW9uKCl7cmV0dXJuIHRoaXMuSEVBUDMyW3RoaXMucHRyMzIrOV19Z2V0IG5leHQoKXtjb25zdCB0PXRoaXMuSEVBUFUzMlt0aGlzLnB0cjMyKzExXTtyZXR1cm4gdD9uZXcgQSh0LHRoaXMuYnVmKTpudWxsfWdldCB0aW1lKCl7cmV0dXJuIHRoaXMuSEVBUFUzMlt0aGlzLnB0cjMyKzEzXX1nZXQgY2FjaGVDb3VudCgpe3JldHVybiB0aGlzLkhFQVAzMlt0aGlzLnB0cjMyKzE0XX1nZXQgcXVhbGl0eSgpe3JldHVybiB0aGlzLkhFQVAzMlt0aGlzLnB0cjMyKzE1XX19Y2xhc3MgZiBleHRlbmRzIHV7Z2V0IGhlYWQoKXtjb25zdCB0PXRoaXMuSEVBUFUzMlt0aGlzLnB0cjMyKzJdO3JldHVybiB0P25ldyBBKHQsdGhpcy5idWYpOm51bGx9fWNsYXNzIGh7Y29uc3RydWN0b3IodCl7dGhpcy50eXBlPXQudHlwZSx0aGlzLnR5cGVOYW1lPXNbdGhpcy50eXBlXSx0aGlzLmRhdGE9dC5kYXRhLHRoaXMucG9pbnRzPXQucG9pbnRzLHRoaXMub3JpZW50YXRpb249dC5vcmllbnRhdGlvbix0aGlzLnRpbWU9dC50aW1lLHRoaXMuY2FjaGVDb3VudD10LmNhY2hlQ291bnQsdGhpcy5xdWFsaXR5PXQucXVhbGl0eX1zdGF0aWMgY3JlYXRlU3ltYm9sc0Zyb21QdHIodCxlKXtpZigwPT10KXJldHVybltdO2xldCBuPW5ldyBmKHQsZSkuaGVhZDtjb25zdCByPVtdO2Zvcig7bnVsbCE9PW47KXIucHVzaChuZXcgaChuKSksbj1uLm5leHQ7cmV0dXJuIHJ9ZGVjb2RlKHQpe3JldHVybiBuZXcgVGV4dERlY29kZXIodCkuZGVjb2RlKHRoaXMuZGF0YSl9fWNsYXNzIGwgZXh0ZW5kcyBfe3N0YXRpYyBjcmVhdGVGcm9tR3JheUJ1ZmZlcihlLG4scixpPTApe3JldHVybiB0KHRoaXMsdm9pZCAwLHZvaWQgMCwoZnVuY3Rpb24qKCl7Y29uc3QgdD15aWVsZCBvKCkscz1uZXcgVWludDhBcnJheShyKSxhPWUqbjtpZihhIT09cy5ieXRlTGVuZ3RoKXRocm93IEVycm9yKGBkYXRhIGxlbmd0aCAoJHtzLmJ5dGVMZW5ndGh9IGJ5dGVzKSBkb2VzIG5vdCBtYXRjaCB3aWR0aCBhbmQgaGVpZ2h0ICgke2F9IGJ5dGVzKWApO2NvbnN0IGM9dC5fbWFsbG9jKGEpO3QuSEVBUFU4LnNldChzLGMpO3JldHVybiBuZXcgdGhpcyh0Ll9JbWFnZV9jcmVhdGUoZSxuLDgwODQ2NjUyMSxjLGEsaSksdCl9KSl9c3RhdGljIGNyZWF0ZUZyb21SR0JBQnVmZmVyKGUsbixyLGk9MCl7cmV0dXJuIHQodGhpcyx2b2lkIDAsdm9pZCAwLChmdW5jdGlvbiooKXtjb25zdCB0PXlpZWxkIG8oKSxzPW5ldyBVaW50OEFycmF5KHIpLGE9ZSpuO2lmKDQqYSE9PXMuYnl0ZUxlbmd0aCl0aHJvdyBFcnJvcihgZGF0YSBsZW5ndGggKCR7cy5ieXRlTGVuZ3RofSBieXRlcykgZG9lcyBub3QgbWF0Y2ggd2lkdGggYW5kIGhlaWdodCAoJHs0KmF9IGJ5dGVzKWApO2NvbnN0IGM9dC5fbWFsbG9jKGEpLF89YythLHU9dC5IRUFQVTg7Zm9yKGxldCB0PWMsZT0wO3Q8Xzt0KyssZSs9NCl1W3RdPTE5NTk1KnNbZV0rMzg0Njkqc1tlKzFdKzc0NzIqc1tlKzJdPj4xNjtyZXR1cm4gbmV3IHRoaXModC5fSW1hZ2VfY3JlYXRlKGUsbiw4MDg0NjY1MjEsYyxhLGkpLHQpfSkpfWRlc3Ryb3koKXt0aGlzLmNoZWNrQWxpdmUoKSx0aGlzLmluc3QuX0ltYWdlX2Rlc3RvcnkodGhpcy5wdHIpLHRoaXMucHRyPTB9Z2V0U3ltYm9scygpe3RoaXMuY2hlY2tBbGl2ZSgpO2NvbnN0IHQ9dGhpcy5pbnN0Ll9JbWFnZV9nZXRfc3ltYm9scyh0aGlzLnB0cik7cmV0dXJuIGguY3JlYXRlU3ltYm9sc0Zyb21QdHIodCx0aGlzLmluc3QuSEVBUFU4LmJ1ZmZlcil9fWNsYXNzIFIgZXh0ZW5kcyBfe3N0YXRpYyBjcmVhdGUoKXtyZXR1cm4gdCh0aGlzLHZvaWQgMCx2b2lkIDAsKGZ1bmN0aW9uKigpe2NvbnN0IHQ9eWllbGQgbygpO3JldHVybiBuZXcgdGhpcyh0Ll9JbWFnZVNjYW5uZXJfY3JlYXRlKCksdCl9KSl9ZGVzdHJveSgpe3RoaXMuY2hlY2tBbGl2ZSgpLHRoaXMuaW5zdC5fSW1hZ2VTY2FubmVyX2Rlc3RvcnkodGhpcy5wdHIpLHRoaXMucHRyPTB9c2V0Q29uZmlnKHQsZSxuKXtyZXR1cm4gdGhpcy5jaGVja0FsaXZlKCksdGhpcy5pbnN0Ll9JbWFnZVNjYW5uZXJfc2V0X2NvbmZpZyh0aGlzLnB0cix0LGUsbil9ZW5hYmxlQ2FjaGUodD0hMCl7dGhpcy5jaGVja0FsaXZlKCksdGhpcy5pbnN0Ll9JbWFnZVNjYW5uZXJfZW5hYmxlX2NhY2hlKHRoaXMucHRyLHQpfXJlY3ljbGVJbWFnZSh0KXt0aGlzLmNoZWNrQWxpdmUoKSx0aGlzLmluc3QuX0ltYWdlU2Nhbm5lcl9yZWN5Y2xlX2ltYWdlKHRoaXMucHRyLHQuZ2V0UG9pbnRlcigpKX1nZXRSZXN1bHRzKCl7dGhpcy5jaGVja0FsaXZlKCk7Y29uc3QgdD10aGlzLmluc3QuX0ltYWdlU2Nhbm5lcl9nZXRfcmVzdWx0cyh0aGlzLnB0cik7cmV0dXJuIGguY3JlYXRlU3ltYm9sc0Zyb21QdHIodCx0aGlzLmluc3QuSEVBUFU4LmJ1ZmZlcil9c2Nhbih0KXtyZXR1cm4gdGhpcy5jaGVja0FsaXZlKCksdGhpcy5pbnN0Ll9JbWFnZVNjYW5uZXJfc2Nhbih0aGlzLnB0cix0LmdldFBvaW50ZXIoKSl9fWNvbnN0IGQ9KCk9PnQodm9pZCAwLHZvaWQgMCx2b2lkIDAsKGZ1bmN0aW9uKigpe2NvbnN0IHQ9eWllbGQgUi5jcmVhdGUoKTtyZXR1cm4gdC5zZXRDb25maWcocy5aQkFSX05PTkUsYS5aQkFSX0NGR19CSU5BUlksMSksdH0pKTtsZXQgbTtjb25zdCBwPShlLG4pPT50KHZvaWQgMCx2b2lkIDAsdm9pZCAwLChmdW5jdGlvbiooKXt2b2lkIDA9PT1uJiYobj1tfHwoeWllbGQgZCgpKSxtPW4pO2NvbnN0IHQ9bi5zY2FuKGUpO2lmKHQ8MCl0aHJvdyBFcnJvcigiU2NhbiBGYWlsZWQiKTtyZXR1cm4gMD09PXQ/W106ZS5nZXRTeW1ib2xzKCl9KSkseT0oZSxuLHIsaSk9PnQodm9pZCAwLHZvaWQgMCx2b2lkIDAsKGZ1bmN0aW9uKigpe2NvbnN0IHQ9eWllbGQgbC5jcmVhdGVGcm9tR3JheUJ1ZmZlcihuLHIsZSksbz15aWVsZCBwKHQsaSk7cmV0dXJuIHQuZGVzdHJveSgpLG99KSksQj0oZSxuLHIsaSk9PnQodm9pZCAwLHZvaWQgMCx2b2lkIDAsKGZ1bmN0aW9uKigpe2NvbnN0IHQ9eWllbGQgbC5jcmVhdGVGcm9tUkdCQUJ1ZmZlcihuLHIsZSksbz15aWVsZCBwKHQsaSk7cmV0dXJuIHQuZGVzdHJveSgpLG99KSksRT0oZSxuKT0+dCh2b2lkIDAsdm9pZCAwLHZvaWQgMCwoZnVuY3Rpb24qKCl7cmV0dXJuIHlpZWxkIEIoZS5kYXRhLmJ1ZmZlcixlLndpZHRoLGUuaGVpZ2h0LG4pfSkpLGc9T2JqZWN0LmZyZWV6ZShPYmplY3QuZGVmaW5lUHJvcGVydHkoe19fcHJvdG9fXzpudWxsfSxTeW1ib2wudG9TdHJpbmdUYWcse3ZhbHVlOiJNb2R1bGUifSkpO2V4cG9ydHthIGFzIFpCYXJDb25maWdUeXBlLGwgYXMgWkJhckltYWdlLGMgYXMgWkJhck9yaWVudGF0aW9uLFIgYXMgWkJhclNjYW5uZXIsaCBhcyBaQmFyU3ltYm9sLHMgYXMgWkJhclN5bWJvbFR5cGUsZCBhcyBnZXREZWZhdWx0U2Nhbm5lcixvIGFzIGdldEluc3RhbmNlLHkgYXMgc2NhbkdyYXlCdWZmZXIsRSBhcyBzY2FuSW1hZ2VEYXRhLEIgYXMgc2NhblJHQkFCdWZmZXIsaSBhcyBzZXRNb2R1bGVBcmdzfTsKLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXgubWpzLm1hcAo=", import.meta.url)), i = (o, h) => (o = U(o) ? new URL(o) : k.normalize(o), I.readFileSync(o, h ? void 0 : "utf8")), l = (o) => {
      var h = i(o, !0);
      return h.buffer || (h = new Uint8Array(h)), h;
    }, c = (o, h, r, Z = !0) => {
      o = U(o) ? new URL(o) : k.normalize(o), I.readFile(o, Z ? void 0 : "utf8", (C, X) => {
        C ? r(C) : h(Z ? X.buffer : X);
      });
    }, !e.thisProgram && process.argv.length > 1 && process.argv[1].replace(/\\/g, "/"), process.argv.slice(2), e.inspect = () => "[Emscripten Module object]";
  } else (b || d) && (d ? m = self.location.href : typeof document < "u" && document.currentScript && (m = document.currentScript.src), _ && (m = _), m = m.indexOf("blob:") !== 0 ? m.substr(0, m.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", i = (n) => {
    var o = new XMLHttpRequest();
    return o.open("GET", n, !1), o.send(null), o.responseText;
  }, d && (l = (n) => {
    var o = new XMLHttpRequest();
    return o.open("GET", n, !1), o.responseType = "arraybuffer", o.send(null), new Uint8Array(o.response);
  }), c = (n, o, h) => {
    var r = new XMLHttpRequest();
    r.open("GET", n, !0), r.responseType = "arraybuffer", r.onload = () => {
      r.status == 200 || r.status == 0 && r.response ? o(r.response) : h();
    }, r.onerror = h, r.send(null);
  });
  var y, S, R, H = e.print || console.log.bind(console), W = e.printErr || console.error.bind(console);
  Object.assign(e, p), p = null, e.arguments && e.arguments, e.thisProgram && e.thisProgram, e.quit && e.quit, e.wasmBinary && (y = e.wasmBinary), e.noExitRuntime, typeof WebAssembly != "object" && at("no native wasm support detected");
  var J, v, O = !1;
  function q() {
    var n = S.buffer;
    e.HEAP8 = new Int8Array(n), e.HEAP16 = new Int16Array(n), e.HEAP32 = new Int32Array(n), e.HEAPU8 = J = new Uint8Array(n), e.HEAPU16 = new Uint16Array(n), e.HEAPU32 = v = new Uint32Array(n), e.HEAPF32 = new Float32Array(n), e.HEAPF64 = new Float64Array(n);
  }
  var $ = [], tt = [], et = [], T = 0, K = null;
  function at(n) {
    e.onAbort && e.onAbort(n), W(n = "Aborted(" + n + ")"), O = !0, n += ". Build with -sASSERTIONS for more info.";
    var o = new WebAssembly.RuntimeError(n);
    throw s(o), o;
  }
  var Q, w, pt = "data:application/octet-stream;base64,";
  function st(n) {
    return n.startsWith(pt);
  }
  function U(n) {
    return n.startsWith("file://");
  }
  function it(n) {
    if (n == Q && y) return new Uint8Array(y);
    if (l) return l(n);
    throw "both async and sync fetching of the wasm failed";
  }
  function nt(n, o, h) {
    return function(r) {
      if (!y && (b || d)) {
        if (typeof fetch == "function" && !U(r)) return fetch(r, { credentials: "same-origin" }).then((Z) => {
          if (!Z.ok) throw "failed to load wasm binary file at '" + r + "'";
          return Z.arrayBuffer();
        }).catch(() => it(r));
        if (c) return new Promise((Z, C) => {
          c(r, (X) => Z(new Uint8Array(X)), C);
        });
      }
      return Promise.resolve().then(() => it(r));
    }(n).then((r) => WebAssembly.instantiate(r, o)).then((r) => r).then(h, (r) => {
      W("failed to asynchronously prepare wasm: " + r), at(r);
    });
  }
  e.locateFile ? st(Q = "zbar.wasm") || (w = Q, Q = e.locateFile ? e.locateFile(w, m) : m + w) : Q = new URL(new URL("wbs-pf-zbar.wasm", import.meta.url).href, import.meta.url).href;
  var L, M = (n) => {
    for (; n.length > 0; ) n.shift()(e);
  }, Zt = (n) => {
    var o = n - S.buffer.byteLength + 65535 >>> 16;
    try {
      return S.grow(o), q(), 1;
    } catch {
    }
  }, ct = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, ft = [null, [], []], yt = (n, o) => {
    var h = ft[n];
    o === 0 || o === 10 ? ((n === 1 ? H : W)(((r, Z, C) => {
      for (var X = Z + C, V = Z; r[V] && !(V >= X); ) ++V;
      if (V - Z > 16 && r.buffer && ct) return ct.decode(r.subarray(Z, V));
      for (var F = ""; Z < V; ) {
        var G = r[Z++];
        if (128 & G) {
          var Y = 63 & r[Z++];
          if ((224 & G) != 192) {
            var x = 63 & r[Z++];
            if ((G = (240 & G) == 224 ? (15 & G) << 12 | Y << 6 | x : (7 & G) << 18 | Y << 12 | x << 6 | 63 & r[Z++]) < 65536) F += String.fromCharCode(G);
            else {
              var rt = G - 65536;
              F += String.fromCharCode(55296 | rt >> 10, 56320 | 1023 & rt);
            }
          } else F += String.fromCharCode((31 & G) << 6 | Y);
        } else F += String.fromCharCode(G);
      }
      return F;
    })(h, 0)), h.length = 0) : h.push(o);
  }, Rt = { d: () => !0, e: function() {
    return Date.now();
  }, c: (n) => {
    var o = J.length, h = 2147483648;
    if ((n >>>= 0) > h) return !1;
    for (var r, Z, C = 1; C <= 4; C *= 2) {
      var X = o * (1 + 0.2 / C);
      X = Math.min(X, n + 100663296);
      var V = Math.min(h, (r = Math.max(n, X)) + ((Z = 65536) - r % Z) % Z);
      if (Zt(V)) return !0;
    }
    return !1;
  }, f: (n) => 52, b: function(n, o, h, r, Z) {
    return 70;
  }, a: (n, o, h, r) => {
    for (var Z = 0, C = 0; C < h; C++) {
      var X = v[o >> 2], V = v[o + 4 >> 2];
      o += 8;
      for (var F = 0; F < V; F++) yt(n, J[X + F]);
      Z += V;
    }
    return v[r >> 2] = Z, 0;
  } };
  function ot() {
    function n() {
      L || (L = !0, e.calledRun = !0, O || (M(tt), t(e), e.onRuntimeInitialized && e.onRuntimeInitialized(), function() {
        if (e.postRun) for (typeof e.postRun == "function" && (e.postRun = [e.postRun]); e.postRun.length; ) o = e.postRun.shift(), et.unshift(o);
        var o;
        M(et);
      }()));
    }
    T > 0 || (function() {
      if (e.preRun) for (typeof e.preRun == "function" && (e.preRun = [e.preRun]); e.preRun.length; ) o = e.preRun.shift(), $.unshift(o);
      var o;
      M($);
    }(), T > 0 || (e.setStatus ? (e.setStatus("Running..."), setTimeout(function() {
      setTimeout(function() {
        e.setStatus("");
      }, 1), n();
    }, 1)) : n()));
  }
  if (function() {
    var n, o, h, r, Z = { a: Rt };
    function C(X, V) {
      var F, G = X.exports;
      return S = (R = G).g, q(), R.s, F = R.h, tt.unshift(F), function(Y) {
        if (T--, e.monitorRunDependencies && e.monitorRunDependencies(T), T == 0 && K) {
          var x = K;
          K = null, x();
        }
      }(), G;
    }
    if (T++, e.monitorRunDependencies && e.monitorRunDependencies(T), e.instantiateWasm) try {
      return e.instantiateWasm(Z, C);
    } catch (X) {
      W("Module.instantiateWasm callback failed with error: " + X), s(X);
    }
    (n = y, o = Q, h = Z, r = function(X) {
      C(X.instance);
    }, n || typeof WebAssembly.instantiateStreaming != "function" || st(o) || U(o) || u || typeof fetch != "function" ? nt(o, h, r) : fetch(o, { credentials: "same-origin" }).then((X) => WebAssembly.instantiateStreaming(X, h).then(r, function(V) {
      return W("wasm streaming compile failed: " + V), W("falling back to ArrayBuffer instantiation"), nt(o, h, r);
    }))).catch(s);
  }(), e._ImageScanner_create = () => (e._ImageScanner_create = R.i)(), e._ImageScanner_destory = (n) => (e._ImageScanner_destory = R.j)(n), e._ImageScanner_set_config = (n, o, h, r) => (e._ImageScanner_set_config = R.k)(n, o, h, r), e._ImageScanner_enable_cache = (n, o) => (e._ImageScanner_enable_cache = R.l)(n, o), e._ImageScanner_recycle_image = (n, o) => (e._ImageScanner_recycle_image = R.m)(n, o), e._ImageScanner_get_results = (n) => (e._ImageScanner_get_results = R.n)(n), e._ImageScanner_scan = (n, o) => (e._ImageScanner_scan = R.o)(n, o), e._Image_create = (n, o, h, r, Z, C) => (e._Image_create = R.p)(n, o, h, r, Z, C), e._Image_destory = (n) => (e._Image_destory = R.q)(n), e._Image_get_symbols = (n) => (e._Image_get_symbols = R.r)(n), e._free = (n) => (e._free = R.t)(n), e._malloc = (n) => (e._malloc = R.u)(n), K = function n() {
    L || ot(), L || (K = n);
  }, e.preInit) for (typeof e.preInit == "function" && (e.preInit = [e.preInit]); e.preInit.length > 0; ) e.preInit.pop()();
  return ot(), a.ready;
});
let P;
function Xt(a = {}) {
  P = function() {
    return B(this, void 0, void 0, function* () {
      const t = yield gt(a);
      if (t) return t;
      throw Error("WASM was not loaded");
    });
  }();
}
function z() {
  return B(this, void 0, void 0, function* () {
    return P || Xt(), yield P;
  });
}
var E, D, dt;
(function(a) {
  a[a.ZBAR_NONE = 0] = "ZBAR_NONE", a[a.ZBAR_PARTIAL = 1] = "ZBAR_PARTIAL", a[a.ZBAR_EAN2 = 2] = "ZBAR_EAN2", a[a.ZBAR_EAN5 = 5] = "ZBAR_EAN5", a[a.ZBAR_EAN8 = 8] = "ZBAR_EAN8", a[a.ZBAR_UPCE = 9] = "ZBAR_UPCE", a[a.ZBAR_ISBN10 = 10] = "ZBAR_ISBN10", a[a.ZBAR_UPCA = 12] = "ZBAR_UPCA", a[a.ZBAR_EAN13 = 13] = "ZBAR_EAN13", a[a.ZBAR_ISBN13 = 14] = "ZBAR_ISBN13", a[a.ZBAR_COMPOSITE = 15] = "ZBAR_COMPOSITE", a[a.ZBAR_I25 = 25] = "ZBAR_I25", a[a.ZBAR_DATABAR = 34] = "ZBAR_DATABAR", a[a.ZBAR_DATABAR_EXP = 35] = "ZBAR_DATABAR_EXP", a[a.ZBAR_CODABAR = 38] = "ZBAR_CODABAR", a[a.ZBAR_CODE39 = 39] = "ZBAR_CODE39", a[a.ZBAR_PDF417 = 57] = "ZBAR_PDF417", a[a.ZBAR_QRCODE = 64] = "ZBAR_QRCODE", a[a.ZBAR_SQCODE = 80] = "ZBAR_SQCODE", a[a.ZBAR_CODE93 = 93] = "ZBAR_CODE93", a[a.ZBAR_CODE128 = 128] = "ZBAR_CODE128", a[a.ZBAR_SYMBOL = 255] = "ZBAR_SYMBOL", a[a.ZBAR_ADDON2 = 512] = "ZBAR_ADDON2", a[a.ZBAR_ADDON5 = 1280] = "ZBAR_ADDON5", a[a.ZBAR_ADDON = 1792] = "ZBAR_ADDON";
})(E || (E = {})), function(a) {
  a[a.ZBAR_CFG_ENABLE = 0] = "ZBAR_CFG_ENABLE", a[a.ZBAR_CFG_ADD_CHECK = 1] = "ZBAR_CFG_ADD_CHECK", a[a.ZBAR_CFG_EMIT_CHECK = 2] = "ZBAR_CFG_EMIT_CHECK", a[a.ZBAR_CFG_ASCII = 3] = "ZBAR_CFG_ASCII", a[a.ZBAR_CFG_BINARY = 4] = "ZBAR_CFG_BINARY", a[a.ZBAR_CFG_NUM = 5] = "ZBAR_CFG_NUM", a[a.ZBAR_CFG_MIN_LEN = 32] = "ZBAR_CFG_MIN_LEN", a[a.ZBAR_CFG_MAX_LEN = 33] = "ZBAR_CFG_MAX_LEN", a[a.ZBAR_CFG_UNCERTAINTY = 64] = "ZBAR_CFG_UNCERTAINTY", a[a.ZBAR_CFG_POSITION = 128] = "ZBAR_CFG_POSITION", a[a.ZBAR_CFG_TEST_INVERTED = 129] = "ZBAR_CFG_TEST_INVERTED", a[a.ZBAR_CFG_X_DENSITY = 256] = "ZBAR_CFG_X_DENSITY", a[a.ZBAR_CFG_Y_DENSITY = 257] = "ZBAR_CFG_Y_DENSITY";
}(D || (D = {})), function(a) {
  a[a.ZBAR_ORIENT_UNKNOWN = -1] = "ZBAR_ORIENT_UNKNOWN", a[a.ZBAR_ORIENT_UP = 0] = "ZBAR_ORIENT_UP", a[a.ZBAR_ORIENT_RIGHT = 1] = "ZBAR_ORIENT_RIGHT", a[a.ZBAR_ORIENT_DOWN = 2] = "ZBAR_ORIENT_DOWN", a[a.ZBAR_ORIENT_LEFT = 3] = "ZBAR_ORIENT_LEFT";
}(dt || (dt = {}));
class mt {
  constructor(t, s) {
    this.ptr = t, this.inst = s;
  }
  checkAlive() {
    if (!this.ptr) throw Error("Call after destroyed");
  }
  getPointer() {
    return this.checkAlive(), this.ptr;
  }
}
class bt {
  constructor(t, s) {
    this.ptr = t, this.ptr32 = t >> 2, this.buf = s, this.HEAP8 = new Int8Array(s), this.HEAPU32 = new Uint32Array(s), this.HEAP32 = new Int32Array(s);
  }
}
class j extends bt {
  get type() {
    return this.HEAPU32[this.ptr32];
  }
  get data() {
    const t = this.HEAPU32[this.ptr32 + 4], s = this.HEAPU32[this.ptr32 + 5];
    return Int8Array.from(this.HEAP8.subarray(s, s + t));
  }
  get points() {
    const t = this.HEAPU32[this.ptr32 + 7], s = this.HEAPU32[this.ptr32 + 8] >> 2, e = [];
    for (let i = 0; i < t; ++i) {
      const c = this.HEAP32[s + 2 * i], l = this.HEAP32[s + 2 * i + 1];
      e.push({ x: c, y: l });
    }
    return e;
  }
  get orientation() {
    return this.HEAP32[this.ptr32 + 9];
  }
  get next() {
    const t = this.HEAPU32[this.ptr32 + 11];
    return t ? new j(t, this.buf) : null;
  }
  get time() {
    return this.HEAPU32[this.ptr32 + 13];
  }
  get cacheCount() {
    return this.HEAP32[this.ptr32 + 14];
  }
  get quality() {
    return this.HEAP32[this.ptr32 + 15];
  }
}
class Ct extends bt {
  get head() {
    const t = this.HEAPU32[this.ptr32 + 2];
    return t ? new j(t, this.buf) : null;
  }
}
class A {
  constructor(t) {
    this.type = t.type, this.typeName = E[this.type], this.data = t.data, this.points = t.points, this.orientation = t.orientation, this.time = t.time, this.cacheCount = t.cacheCount, this.quality = t.quality;
  }
  static createSymbolsFromPtr(t, s) {
    if (t == 0) return [];
    let e = new Ct(t, s).head;
    const i = [];
    for (; e !== null; ) i.push(new A(e)), e = e.next;
    return i;
  }
  decode(t) {
    return new TextDecoder(t).decode(this.data);
  }
}
class St extends mt {
  static createFromGrayBuffer(t, s, e, i = 0) {
    return B(this, void 0, void 0, function* () {
      const c = yield z(), l = new Uint8Array(e), p = t * s;
      if (p !== l.byteLength) throw Error(`data length (${l.byteLength} bytes) does not match width and height (${p} bytes)`);
      const b = c._malloc(p);
      return c.HEAPU8.set(l, b), new this(c._Image_create(t, s, 808466521, b, p, i), c);
    });
  }
  static createFromRGBABuffer(t, s, e, i = 0) {
    return B(this, void 0, void 0, function* () {
      const c = yield z(), l = new Uint8Array(e), p = t * s;
      if (4 * p !== l.byteLength) throw Error(`data length (${l.byteLength} bytes) does not match width and height (${4 * p} bytes)`);
      const b = c._malloc(p), d = b + p, u = c.HEAPU8;
      for (let m = b, g = 0; m < d; m++, g += 4) u[m] = 19595 * l[g] + 38469 * l[g + 1] + 7472 * l[g + 2] >> 16;
      return new this(c._Image_create(t, s, 808466521, b, p, i), c);
    });
  }
  destroy() {
    this.checkAlive(), this.inst._Image_destory(this.ptr), this.ptr = 0;
  }
  getSymbols() {
    this.checkAlive();
    const t = this.inst._Image_get_symbols(this.ptr);
    return A.createSymbolsFromPtr(t, this.inst.HEAPU8.buffer);
  }
}
class Vt extends mt {
  static create() {
    return B(this, void 0, void 0, function* () {
      const t = yield z();
      return new this(t._ImageScanner_create(), t);
    });
  }
  destroy() {
    this.checkAlive(), this.inst._ImageScanner_destory(this.ptr), this.ptr = 0;
  }
  setConfig(t, s, e) {
    return this.checkAlive(), this.inst._ImageScanner_set_config(this.ptr, t, s, e);
  }
  enableCache(t = !0) {
    this.checkAlive(), this.inst._ImageScanner_enable_cache(this.ptr, t);
  }
  recycleImage(t) {
    this.checkAlive(), this.inst._ImageScanner_recycle_image(this.ptr, t.getPointer());
  }
  getResults() {
    this.checkAlive();
    const t = this.inst._ImageScanner_get_results(this.ptr);
    return A.createSymbolsFromPtr(t, this.inst.HEAPU8.buffer);
  }
  scan(t) {
    return this.checkAlive(), this.inst._ImageScanner_scan(this.ptr, t.getPointer());
  }
}
const It = () => B(void 0, void 0, void 0, function* () {
  const a = yield Vt.create();
  return a.setConfig(E.ZBAR_NONE, D.ZBAR_CFG_BINARY, 1), a;
});
let ut;
const Gt = (a, t) => B(void 0, void 0, void 0, function* () {
  t === void 0 && (t = ut || (yield It()), ut = t);
  const s = t.scan(a);
  if (s < 0) throw Error("Scan Failed");
  return s === 0 ? [] : a.getSymbols();
}), Wt = (a, t, s, e) => B(void 0, void 0, void 0, function* () {
  const i = yield St.createFromRGBABuffer(t, s, a), c = yield Gt(i, e);
  return i.destroy(), c;
}), Ft = (a, t) => B(void 0, void 0, void 0, function* () {
  return yield Wt(a.data.buffer, a.width, a.height, t);
}), kt = Object.freeze(Object.defineProperty({ __proto__: null }, Symbol.toStringTag, { value: "Module" }));
class ht {
  constructor(t) {
    this.formats = t, this.canvas = document.createElement("canvas");
    const s = this.canvas.getContext("2d", { willReadFrequently: !0 });
    if (!s)
      throw new Error("Failed to get 2D context for ZBar decoder");
    this.ctx = s;
  }
  async decode(t) {
    try {
      this.canvas.width = t.videoWidth, this.canvas.height = t.videoHeight, this.ctx.drawImage(t, 0, 0);
      const s = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height), e = await Ft(s);
      return !e || e.length === 0 ? [] : e.filter((i) => this.isFormatSupported(i.typeName)).map((i) => ({
        rawValue: i.decode(),
        format: this.mapZBarFormat(i.typeName),
        boundingBox: i.points && i.points.length >= 2 ? {
          x: Math.min(...i.points.map((c) => c.x)),
          y: Math.min(...i.points.map((c) => c.y)),
          width: Math.max(...i.points.map((c) => c.x)) - Math.min(...i.points.map((c) => c.x)),
          height: Math.max(...i.points.map((c) => c.y)) - Math.min(...i.points.map((c) => c.y))
        } : void 0
      }));
    } catch {
      return [];
    }
  }
  isFormatSupported(t) {
    const s = this.getZBarFormatMap(), e = t.toLowerCase();
    for (const [i, c] of Object.entries(s))
      if (c === e && this.formats.includes(i))
        return !0;
    return !1;
  }
  mapZBarFormat(t) {
    const s = this.getZBarFormatMap(), e = t.toLowerCase();
    for (const [i, c] of Object.entries(s))
      if (c === e)
        return i;
    return t;
  }
  getZBarFormatMap() {
    return {
      [f.CODE_128]: "zbar_code128",
      [f.CODE_39]: "zbar_code39",
      [f.CODE_93]: "zbar_code93",
      [f.CODABAR]: "zbar_codabar",
      [f.EAN_8]: "zbar_ean8",
      [f.EAN_13]: "zbar_ean13",
      [f.ITF]: "zbar_i25",
      [f.UPC_A]: "zbar_upca",
      [f.UPC_E]: "zbar_upce",
      [f.QR_CODE]: "zbar_qrcode",
      [f.DATA_MATRIX]: "zbar_none",
      [f.PDF417]: "zbar_pdf417"
    };
  }
  destroy() {
    this.canvas.width = 0, this.canvas.height = 0;
  }
}
class Bt {
  constructor(t) {
    if (this.stream = null, this.track = null, this.decoder = null, this.scanning = !1, this.focusing = !1, this.manualFocusMode = !1, this.useZoomHack = !0, this.decoding = !1, this.lastDecodeTime = 0, this.minDecodeInterval = 100, this.focusElements = [], this.availableCameras = [], this.currentCameraIndex = 0, this.focusDistanceCapability = null, this.container = t.container, this.onCodeScanned = t.onCodeScanned || (() => {
    }), this.onError = t.onError || (() => {
    }), this.onLoadingStart = t.onLoadingStart ?? (() => {
    }), this.onLoadingEnd = t.onLoadingEnd ?? (() => {
    }), this.debug = t.debug || !1, this.useZoomHack = t.useZoomHack ?? !0, this.detectorType = t.detectorType || N.AUTO, this.formats = t.formats || Object.values(f), !this.container)
      throw new Error("Container element is required");
    this.video = document.createElement("video"), this.video.className = "barcode-scanner-video", this.video.setAttribute("playsinline", ""), this.video.setAttribute("autoplay", ""), this.canvas = document.createElement("canvas"), this.canvas.className = "barcode-scanner-canvas", this.container.appendChild(this.video), this.container.appendChild(this.canvas);
    const s = this.canvas.getContext("2d", { willReadFrequently: !0 });
    if (!s)
      throw new Error("Failed to get 2D context from canvas");
    this.ctx = s;
  }
  log(...t) {
    this.debug && console.log("[WebBarcodeScanner]", ...t);
  }
  warn(...t) {
    this.debug && console.warn("[WebBarcodeScanner]", ...t);
  }
  error(...t) {
    this.debug && console.error("[WebBarcodeScanner]", ...t);
  }
  async initializeDecoder() {
    let t = this.detectorType;
    t === N.AUTO && (typeof window.BarcodeDetector < "u" ? (t = N.NATIVE, this.log("Auto-selected Native BarcodeDetector")) : (t = N.ZBAR, this.log("Auto-selected ZBar decoder (Native not available)")));
    try {
      if (t === "native")
        this.decoder = new lt(this.formats), this.log("Initialized Native BarcodeDetector");
      else if (t === "zbar")
        this.decoder = new ht(this.formats), this.log("Initialized ZBar decoder");
      else
        throw new Error(`Unknown detector type: ${t}`);
    } catch (s) {
      const e = s;
      throw this.error("Failed to initialize decoder:", e), this.onError({ type: "decoder", message: e.message, error: e }), e;
    }
  }
  async init() {
    try {
      this.onLoadingStart(), await this.initializeDecoder(), await this.setupCamera(), this.setupEventListeners(), this.startScanning(), this.onLoadingEnd();
    } catch (t) {
      const s = t;
      throw this.error("Init error:", s), this.onLoadingEnd(), this.onError({ type: "init", message: s.message, error: s }), s;
    }
  }
  async setupCamera() {
    let t = null;
    try {
      t = await navigator.mediaDevices.getUserMedia({ video: !0 }), this.log("Camera permission granted");
    } catch (c) {
      const l = c;
      throw this.error("Camera permission denied:", l), new Error("Camera permission denied");
    }
    const s = await navigator.mediaDevices.enumerateDevices();
    this.availableCameras = s.filter((c) => c.kind === "videoinput"), this.log("Available cameras:", this.availableCameras.map((c, l) => `[${l}] ${c.label}`)), t && t.getTracks().forEach((c) => c.stop()), this.currentCameraIndex === 0 && await this.selectBestCamera();
    const e = this.availableCameras[this.currentCameraIndex];
    this.log(`Using camera [${this.currentCameraIndex}]:`, e == null ? void 0 : e.label);
    const i = {
      video: {
        deviceId: e ? { exact: e.deviceId } : void 0,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };
    this.stream = await navigator.mediaDevices.getUserMedia(i), this.track = this.stream.getVideoTracks()[0], this.video.srcObject = this.stream, await new Promise((c) => {
      this.video.onloadedmetadata = () => c();
    }), await this.setupContinuousFocus();
  }
  async selectBestCamera() {
    var l, p, b;
    const t = this.availableCameras.map((d, u) => ({ device: d, index: u }));
    let s = t.filter(
      ({ device: d }) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("rear") || d.label.toLowerCase().includes("environment")
    );
    this.log("Found back cameras:", s.map((d) => `[${d.index}] ${d.device.label}`)), s.length === 0 && (s = t);
    const e = s.find((d) => {
      var u;
      return (u = d.device.label) == null ? void 0 : u.toLowerCase().split(" ").join("").includes("backdualwidecamera");
    });
    if (e != null) {
      this.currentCameraIndex = e.index;
      return;
    }
    let i = null, c = 0;
    for (const { device: d, index: u } of s)
      try {
        const m = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: d.deviceId } }
        }), g = m.getVideoTracks()[0], I = g.getCapabilities();
        if (g.stop(), m.getTracks().forEach((H) => H.stop()), !((l = I.facingMode) == null ? void 0 : l.includes("environment")))
          continue;
        const y = ((p = I.focusDistance) == null ? void 0 : p.min) ?? null, S = ((b = I.focusDistance) == null ? void 0 : b.max) ?? (y != null ? 1 : null), R = y !== null && S !== null ? S - y : 0;
        this.log(`Camera [${u}] "${d.label}" focus range:`, R), R > c && (c = R, i = u);
      } catch (m) {
        this.warn(`Could not test camera [${u}]:`, m);
      }
    if (i == null && c === 0) {
      this.log("No camera with focus distance support found, trying iOS camera selection");
      const d = s.find(
        ({ device: u }) => u.label.toLowerCase().includes("ultra wide") || u.label.toLowerCase().includes("ultrawide")
      );
      if (d)
        i = d.index, this.log(`Selected Ultra Wide camera [${i}]`);
      else {
        const u = s.find(
          ({ device: m }) => m.label.toLowerCase().includes("wide")
        );
        u ? (i = u.index, this.log(`Selected Wide camera [${i}]`)) : (i = s[0].index, this.log(`Selected first back camera [${i}]`));
      }
    } else
      this.log(`Auto-selected camera [${i}] with best focus range: ${c.toFixed(2)}`);
    i !== null && (this.currentCameraIndex = i);
  }
  async setupContinuousFocus() {
    var l, p;
    if (!this.track) return;
    const t = this.track.getCapabilities();
    this.log("Camera capabilities:", t);
    const s = t.focusMode && t.focusMode.length > 0, e = ((l = t.focusDistance) == null ? void 0 : l.min) ?? null, i = ((p = t.focusDistance) == null ? void 0 : p.max) ?? null, c = e !== null;
    this.log("Focus Mode support:", s ? t.focusMode : "None"), this.log("Focus Distance support:", c ? { min: e, max: i } : "None"), this.focusDistanceCapability = c ? t.focusDistance : null;
    try {
      if (this.useZoomHack && t.zoom) {
        const b = t.zoom.min ?? 1, d = t.zoom.max ?? 1, u = Math.max(b, Math.min(d, 1.4));
        await this.track.applyConstraints({
          advanced: [{ zoom: u }]
        }), this.log("Zoom set to:", u);
      }
    } catch (b) {
      this.warn("Could not set zoom:", b);
    }
    try {
      s && t.focusMode && t.focusMode.includes("continuous") && (await this.track.applyConstraints({
        advanced: [{ focusMode: "continuous" }]
      }), this.log("Continuous focus enabled")), e !== null && (await this.track.applyConstraints({
        advanced: [{ focusDistance: e }]
      }), this.log("Focus distance set to minimum for close range"));
    } catch (b) {
      this.warn("Could not set continuous focus:", b);
    }
    this.log("Current settings:", this.track.getSettings());
  }
  setupEventListeners() {
    this.container.addEventListener("click", (t) => this.handleTapToFocus(t));
  }
  createFocusIndicator(t, s) {
    this.clearFocusIndicators();
    const e = document.createElement("div");
    e.className = "focus-outer active", e.style.left = t + "px", e.style.top = s + "px", this.container.appendChild(e), this.focusElements.push(e);
    const i = document.createElement("div");
    i.className = "focus-square active", i.style.left = t + "px", i.style.top = s + "px";
    const c = document.createElement("div");
    c.className = "focus-corner-bl", i.appendChild(c);
    const l = document.createElement("div");
    l.className = "focus-corner-br", i.appendChild(l), this.container.appendChild(i), this.focusElements.push(i), setTimeout(() => {
      this.clearFocusIndicators();
    }, 2e3);
  }
  clearFocusIndicators() {
    this.focusElements.forEach((t) => t.remove()), this.focusElements = [];
  }
  async handleTapToFocus(t) {
  }
  async searchBestFocus(t, s, e) {
    var p, b, d;
    if (!this.track) return;
    const i = this.track.getCapabilities(), c = ((p = i.focusDistance) == null ? void 0 : p.min) ?? null, l = ((b = i.focusDistance) == null ? void 0 : b.max) ?? null;
    if (c === null || l === null) {
      this.warn("Focus distance not supported, trying fallback"), await this.fallbackFocus();
      return;
    }
    try {
      const u = ((d = i.focusDistance) == null ? void 0 : d.step) ?? (l - c) / 15;
      this.log("Focus range:", c, "to", l, "step:", u);
      const m = 100;
      this.canvas.width = m, this.canvas.height = m;
      let g = c, I = 0;
      const k = [];
      for (let y = c; y <= l; y += u * 2)
        k.push(y);
      this.log("Testing", k.length, "focus distances");
      for (const y of k)
        try {
          await this.track.applyConstraints({
            advanced: [{
              focusMode: "manual",
              focusDistance: y
            }]
          }), this.manualFocusMode = !0, await new Promise((R) => setTimeout(R, 120));
          const S = this.calculateContrast(t, s, e, m);
          this.log("Distance:", y.toFixed(2), "Contrast:", S.toFixed(2)), S > I && (I = S, g = y);
        } catch (S) {
          this.warn("Focus adjustment failed at distance", y, S);
        }
      this.log("Best focus found:", g, "with contrast:", I), await this.track.applyConstraints({
        advanced: [{
          focusMode: "manual",
          focusDistance: g
        }]
      }), setTimeout(async () => {
        if (this.track && i.focusMode && i.focusMode.includes("continuous"))
          try {
            await this.track.applyConstraints({
              advanced: [{ focusMode: "continuous" }]
            }), this.manualFocusMode = !1, this.log("Returned to continuous focus");
          } catch (y) {
            this.warn("Could not return to continuous:", y);
          }
      }, 2500);
    } catch (u) {
      const m = u;
      this.error("Search best focus error:", m), this.onError({ type: "focus", message: "Focus failed", error: m });
    }
  }
  calculateContrast(t, s, e, i) {
    const c = this.video.videoWidth / e.width, l = this.video.videoHeight / e.height, p = Math.max(0, (t - i / 2) * c), b = Math.max(0, (s - i / 2) * l), d = Math.min(i * c, this.video.videoWidth - p), u = Math.min(i * l, this.video.videoHeight - b);
    this.ctx.drawImage(
      this.video,
      p,
      b,
      d,
      u,
      0,
      0,
      i,
      i
    );
    const g = this.ctx.getImageData(0, 0, i, i).data;
    let I = 0, k = 0;
    const y = g.length / 4;
    for (let W = 0; W < g.length; W += 4) {
      const J = g[W] * 0.299 + g[W + 1] * 0.587 + g[W + 2] * 0.114;
      I += J, k += J * J;
    }
    const S = I / y, R = k / y - S * S;
    return Math.sqrt(Math.max(0, R));
  }
  async fallbackFocus() {
    if (!this.track) return;
    const t = this.track.getCapabilities();
    try {
      t.focusMode && t.focusMode.includes("single-shot") && (await this.track.applyConstraints({
        advanced: [{ focusMode: "single-shot" }]
      }), this.log("Single-shot focus triggered"), setTimeout(async () => {
        this.track && t.focusMode && t.focusMode.includes("continuous") && await this.track.applyConstraints({
          advanced: [{ focusMode: "continuous" }]
        });
      }, 1500));
    } catch (s) {
      this.warn("Fallback focus failed:", s);
    }
  }
  async switchCamera() {
    var t;
    if (this.availableCameras.length <= 1)
      return this.log("Only one camera available"), { success: !1, message: "Only one camera available" };
    this.track && this.track.stop(), this.stream && this.stream.getTracks().forEach((s) => s.stop()), this.manualFocusMode = !1, this.currentCameraIndex = (this.currentCameraIndex + 1) % this.availableCameras.length;
    try {
      return await this.setupCamera(), {
        success: !0,
        cameraIndex: this.currentCameraIndex,
        totalCameras: this.availableCameras.length,
        cameraLabel: (t = this.availableCameras[this.currentCameraIndex]) == null ? void 0 : t.label
      };
    } catch (s) {
      const e = s;
      return this.error("Camera switch error:", e), this.onError({ type: "camera_switch", message: "Camera switch failed", error: e }), { success: !1, message: "Camera switch failed" };
    }
  }
  async toggleFlash() {
    if (!this.track)
      return { success: !1, message: "Camera not initialized" };
    try {
      if (this.track.getCapabilities().torch) {
        const i = !(this.track.getSettings().torch || !1);
        return await this.track.applyConstraints({
          advanced: [{ torch: i }]
        }), this.log("Flash toggled:", i), { success: !0, enabled: i };
      } else
        return { success: !1, message: "Flash not supported" };
    } catch (t) {
      const s = t;
      return this.error("Flash toggle error:", s), this.onError({ type: "flash", message: "Flash toggle failed", error: s }), { success: !1, message: "Flash error" };
    }
  }
  getCameraInfo() {
    var c, l, p, b;
    const t = (c = this.track) == null ? void 0 : c.getCapabilities(), s = ((l = t == null ? void 0 : t.focusDistance) == null ? void 0 : l.min) ?? null, e = ((p = t == null ? void 0 : t.focusDistance) == null ? void 0 : p.max) ?? null, i = s !== null && e !== null;
    return {
      cameraLabel: ((b = this.availableCameras[this.currentCameraIndex]) == null ? void 0 : b.label) || "Unknown",
      cameraIndex: this.currentCameraIndex,
      totalCameras: this.availableCameras.length,
      hasFocusDistance: i,
      focusDistanceRange: i ? { min: s, max: e } : null,
      capabilities: t
    };
  }
  async setFocusDistance(t) {
    if (!this.focusDistanceCapability)
      return { success: !1, message: "Focus distance not supported" };
    if (!this.track)
      return { success: !1, message: "Camera not initialized" };
    try {
      const s = this.track.getCapabilities();
      return this.manualFocusMode || s.focusMode && s.focusMode.includes("manual") && (await this.track.applyConstraints({
        advanced: [{ focusMode: "manual" }]
      }), this.manualFocusMode = !0, this.log("Switched to manual focus mode")), await this.track.applyConstraints({
        advanced: [{ focusDistance: t }]
      }), this.log("Focus distance set to:", t), { success: !0, distance: t };
    } catch (s) {
      return this.warn("Could not adjust focus distance:", s), { success: !1, message: "Failed to set focus distance" };
    }
  }
  startScanning() {
    this.scanning = !0, this.scan();
  }
  scan() {
    this.scanning && requestAnimationFrame(async () => {
      const t = Date.now();
      if (t - this.lastDecodeTime < this.minDecodeInterval) {
        this.scan();
        return;
      }
      if (this.decoding) {
        this.scan();
        return;
      }
      this.decoding = !0, this.lastDecodeTime = t;
      try {
        if (this.decoder && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
          const e = await this.decoder.decode(this.video);
          if (e.length > 0) {
            const i = e[0];
            this.log("Barcode scanned:", i.rawValue, "Format:", i.format), this.onCodeScanned(i.rawValue, i.format), await new Promise((c) => setTimeout(c, 1e3));
          }
        }
      } catch (e) {
        const i = e;
        this.warn("Scan error:", i);
      } finally {
        this.decoding = !1;
      }
      this.scan();
    });
  }
  stop() {
    if (this.log("Stopping scanner..."), this.scanning = !1, this.clearFocusIndicators(), this.decoder && (this.decoder.destroy(), this.decoder = null), this.track && this.track.stop(), this.stream && this.stream.getTracks().forEach((t) => t.stop()), this.video.srcObject && (this.video.srcObject = null), this.stream = null, this.track = null, this.container)
      try {
        this.container.innerHTML = "";
      } catch {
      }
    this.log("Scanner stopped");
  }
  isScanning() {
    return this.scanning;
  }
  isFocusing() {
    return this.focusing;
  }
  getVideoElement() {
    return this.video;
  }
  getCanvasElement() {
    return this.canvas;
  }
  getStream() {
    return this.stream;
  }
  getTrack() {
    return this.track;
  }
  getDecoderType() {
    return this.decoder ? this.decoder instanceof lt ? "native" : this.decoder instanceof ht ? "zbar" : "unknown" : "none";
  }
  getSupportedFormats() {
    return [...this.formats];
  }
}
export {
  N as BarcodeDetectorType,
  f as BarcodeFormat,
  Bt as WebBarcodeScanner
};
