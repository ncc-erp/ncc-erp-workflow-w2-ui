var Mezon = Mezon || {};
(() => {
  var e = {
      d: (t, n) => {
        for (var r in n)
          e.o(n, r) &&
            !e.o(t, r) &&
            Object.defineProperty(t, r, { enumerable: !0, get: n[r] });
      },
      o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
      r: (e) => {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(e, '__esModule', { value: !0 });
      },
    },
    t = {};
  (() => {
    'use strict';
    e.r(t), e.d(t, { WebView: () => s });
    const n = '*';
    var r, a;
    function i(e) {
      try {
        const t = e.replace(/\+/g, '%20');
        return decodeURIComponent(t);
      } catch (t) {
        return e;
      }
    }
    !(function (e) {
      (e.ThemeChanged = 'theme_changed'),
        (e.ViewPortChanged = 'viewport_changed'),
        (e.SetCustomStyle = 'set_custom_style'),
        (e.ReloadIframe = 'reload_iframe');
    })(r || (r = {})),
      (function (e) {
        (e.IframeReady = 'iframe_ready'),
          (e.IframeWillReloaded = 'iframe_will_reload');
      })(a || (a = {}));
    const s = new (class {
      constructor() {
        this.eventHandlers = {};
        this.locationHash = '';
        this.initParams = {};
        this.isIframe = !1;
        this.initData();
        this.initIframe();
      }
      postEvent(e, t, r) {
        r ||= function () {};
        console.log('[Mezon.WebView] > postEvent', e, t);
        if (this.isIframe) {
          try {
            const a = n;
            window.parent.postMessage(
              JSON.stringify({ eventType: e, eventData: t }),
              a
            );
            r();
          } catch (e) {
            r(e);
          }
        } else {
          r({ notAvailable: !0 });
        }
      }
      receiveEvent(e, t) {
        console.log('[Mezon.WebView] < receiveEvent', e, t);
        this.callEventCallbacks(e, (n) => {
          n(e, t);
        });
      }
      onEvent(e, t) {
        if (!Array.isArray(this.eventHandlers[e])) {
          this.eventHandlers[e] = [];
        }
        if (!this.eventHandlers[e].includes(t)) {
          this.eventHandlers[e].push(t);
        }
      }
      offEvent(e, t) {
        if (!Array.isArray(this.eventHandlers[e])) return;
        const n = this.eventHandlers[e].indexOf(t);
        if (n !== -1) this.eventHandlers[e].splice(n, 1);
      }
      initData() {
        this.locationHash = window.location.hash.toString();
        this.initParams = (function (e) {
          const t = {};
          if (!(e = e.replace(/^#/, '')).length) return t;
          if (e.indexOf('=') < 0 && e.indexOf('?') < 0) {
            t._path = i(e);
            return t;
          }
          const n = e.indexOf('?');
          if (n >= 0) {
            const r = e.substr(0, n);
            t._path = i(r);
            e = e.substr(n + 1);
          }
          const a = (function (e) {
            const t = {};
            if (!e.length) return t;
            const n = e.split('&');
            for (let r = 0; r < n.length; r++) {
              const a = n[r].split('=');
              const s = i(a[0]);
              const o = a[1] == null ? null : i(a[1]);
              t[s] = o;
            }
            return t;
          })(e);
          for (const s in a) t[s] = a[s];
          return t;
        })(this.locationHash);
        const e = (function () {
          try {
            const e = window.sessionStorage.getItem('__mezon__initParams');
            return e ? JSON.parse(e) : null;
          } catch (e) {
            return null;
          }
        })();
        if (e) {
          for (const t in e) {
            if (this.initParams[t] === undefined) {
              this.initParams[t] = e[t];
            }
          }
        }
        (function (e, t) {
          try {
            window.sessionStorage.setItem(
              '__mezon__initParams',
              JSON.stringify(t)
            );
            return !0;
          } catch (e) {
            return !1;
          }
        })(0, this.initParams);
      }
      initIframe() {
        try {
          if (
            ((this.isIframe =
              window.parent != null && window !== window.parent),
            !this.isIframe)
          ) {
            return;
          }
          this.handleMessage();
          this.iFrameStyle = document.createElement('style');
          document.head.appendChild(this.iFrameStyle);
          try {
            window.parent.postMessage(
              JSON.stringify({
                eventType: a.IframeReady,
                eventData: { reload_supported: !0 },
              }),
              '*'
            );
          } catch (e) {
            /* intentionally empty */
          }
        } catch (e) {
          /* intentionally empty */
        }
      }
      handleMessage() {
        window.addEventListener('message', (t) => {
          if (t.source !== window.parent) return;
          let i = {};
          try {
            i = JSON.parse(t.data);
          } catch (e) {
            return;
          }
          if (i && i.eventType) {
            switch (i.eventType) {
              case r.SetCustomStyle:
                if (t.origin === n && typeof i.eventData === 'string') {
                  this.iFrameStyle.innerHTML = i.eventData;
                }
                break;
              case r.ReloadIframe:
                try {
                  window.parent.postMessage(
                    JSON.stringify({ eventType: a.IframeWillReloaded }),
                    '*'
                  );
                } catch (e) {
                  console.log('error', e);
                }
                location.reload();
                break;
              default:
                this.receiveEvent(i.eventType, i.eventData);
            }
          }
        });
      }
      callEventCallbacks(e, t) {
        const n = this.eventHandlers[e];
        if (n !== undefined && n.length) {
          for (let r = 0; r < n.length; r++) {
            try {
              t(n[r]);
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    })();
  })();
  var n = typeof Mezon === 'undefined' ? (Mezon = {}) : Mezon;
  for (var r in t) n[r] = t[r];
  if (t.__esModule) {
    Object.defineProperty(n, '__esModule', { value: !0 });
  }
})();
