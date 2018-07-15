import app, { App, ActionsType, noop, Sub } from 'hydux'
import { h, render as _render, Component } from 'preact'
import shallowCompare from 'shallow-compare'

const React = { createElement: h }

export { React, h }

export class PureComp extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render() {
    const { children } = this.props
    if (typeof children === 'function') {
      return (children as any)()
    }
    return children
  }
}

export function PureView(props) {
  return (
    <PureComp {...props}>
      {props.children}
    </PureComp>
  )
}

export abstract class HyduxComponent<Props, State, Actions> extends Component<Props, { state: State }> {
  abstract init: (props: this['props']) => State
  abstract actions: ActionsType<State, Actions>
  abstract view: (props: this['props'], state: State, actions: Actions) => JSX.Element | null
  ctx: {
    actions: Actions,
    state: State
  }
  state = {
    state: null as any as State
  }
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.setState({
      state: this.init(this.props),
    })
    this.ctx = app<State, Actions>({
      init: () => this.init(this.props),
      actions: this.actions,
      view: noop,
      onRender: _ => {
        if (!this.ctx) {
          return
        }
        this.setState({
          state: this.ctx.state,
        })
      }
    })
  }

  render() {
    return this.view(
      this.props,
      this.state.state,
      this.ctx.actions,
    )
  }

}

export interface Options {
  raf?: boolean,
  debug?: boolean,
}

const __HYDUX_RENDER_ROOT__ = '__HYDUX_RENDER_ROOT__'
let mounted = false
export default function withPreact<State, Actions>(container: Element = document.body, options: Options = {}): (app: App<State, Actions>) => App<State, Actions> {
  let rafId
  options = {
    raf: true,
    ...options
  }

  // fix duplicate node in hmr
  const render = (view: any) => {
    container[__HYDUX_RENDER_ROOT__] = _render(
      view,
      container,
      container[__HYDUX_RENDER_ROOT__],
    )
  }
  const UpdateEvent = '@hydux-preact/update-state'
  if (options.debug) {
    class Root extends Component {
      state = {}
      actions: any
      view: (s: any, a: any) => any = f => null
      componentDidMount() {
        document.addEventListener(UpdateEvent, (e: CustomEvent) => {
          this.view = e.detail[0]
          this.actions = e.detail[2]
          this.setState(e.detail[1])
        })
      }
      render() {
        return this.view(this.state, this.actions)
      }
    }
    if (!mounted) {
      mounted = true
      render(h(Root, null))
    }
  }
  return app => props => app({
    ...props,
    view: (s, a) => {
      if (options.raf || options.debug) {
        return [props.view, s, a]
      }
      return props.view(s, a)
    },
    onRender(view) {
      props.onRender && props.onRender(view)
      if (options!.debug) {
        document.dispatchEvent(new CustomEvent(UpdateEvent, {
          detail: view
        }))
        return
      }
      if (!options.raf) {
        return render(view)
      }
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
      rafId = window.requestAnimationFrame(() => {
        render(view[0](view[1], view[2]))
      })
    }
  })
}
