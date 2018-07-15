var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import app, { noop } from 'hydux';
import { h, render as _render, Component } from 'preact';
import shallowCompare from 'shallow-compare';
var React = { createElement: h };
export { React, h };
var PureComp = /** @class */ (function (_super) {
    __extends(PureComp, _super);
    function PureComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PureComp.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    };
    PureComp.prototype.render = function () {
        var children = this.props.children;
        if (typeof children === 'function') {
            return children();
        }
        return children;
    };
    return PureComp;
}(Component));
export { PureComp };
export function PureView(props) {
    return (React.createElement(PureComp, __assign({}, props), props.children));
}
var HyduxComponent = /** @class */ (function (_super) {
    __extends(HyduxComponent, _super);
    function HyduxComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            state: null
        };
        return _this;
    }
    HyduxComponent.prototype.componentWillMount = function () {
        var _this = this;
        this.setState({
            state: this.init(this.props),
        });
        this.ctx = app({
            init: function () { return _this.init(_this.props); },
            actions: this.actions,
            view: noop,
            onRender: function (_) {
                if (!_this.ctx) {
                    return;
                }
                _this.setState({
                    state: _this.ctx.state,
                });
            }
        });
    };
    HyduxComponent.prototype.render = function () {
        return this.view(this.props, this.state.state, this.ctx.actions);
    };
    return HyduxComponent;
}(Component));
export { HyduxComponent };
var __HYDUX_RENDER_ROOT__ = '__HYDUX_RENDER_ROOT__';
var mounted = false;
export default function withPreact(container, options) {
    if (container === void 0) { container = document.body; }
    if (options === void 0) { options = {}; }
    var rafId;
    options = __assign({ raf: true }, options);
    // fix duplicate node in hmr
    var render = function (view) {
        container[__HYDUX_RENDER_ROOT__] = _render(view, container, container[__HYDUX_RENDER_ROOT__]);
    };
    var UpdateEvent = '@hydux-preact/update-state';
    if (options.debug) {
        var Root = /** @class */ (function (_super) {
            __extends(Root, _super);
            function Root() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.state = {};
                _this.view = function (f) { return null; };
                return _this;
            }
            Root.prototype.componentDidMount = function () {
                var _this = this;
                document.addEventListener(UpdateEvent, function (e) {
                    _this.view = e.detail[0];
                    _this.actions = e.detail[2];
                    _this.setState(e.detail[1]);
                });
            };
            Root.prototype.render = function () {
                return this.view(this.state, this.actions);
            };
            return Root;
        }(Component));
        if (!mounted) {
            mounted = true;
            render(h(Root, null));
        }
    }
    return function (app) { return function (props) { return app(__assign({}, props, { view: function (s, a) {
            if (options.raf || options.debug) {
                return [props.view, s, a];
            }
            return props.view(s, a);
        }, onRender: function (view) {
            props.onRender && props.onRender(view);
            if (options.debug) {
                document.dispatchEvent(new CustomEvent(UpdateEvent, {
                    detail: view
                }));
                return;
            }
            if (!options.raf) {
                return render(view);
            }
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
            rafId = window.requestAnimationFrame(function () {
                render(view[0](view[1], view[2]));
            });
        } })); }; };
}
//# sourceMappingURL=index.js.map