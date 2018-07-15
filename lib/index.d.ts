import { App, ActionsType } from 'hydux';
import { h, Component } from 'preact';
declare const React: {
    createElement: typeof h;
};
export { React, h };
export declare class PureComp extends Component {
    shouldComponentUpdate(nextProps: any, nextState: any): any;
    render(): any;
}
export declare function PureView(props: any): JSX.Element;
export declare abstract class HyduxComponent<Props, State, Actions> extends Component<Props, {
    state: State;
}> {
    abstract init: (props: this['props']) => State;
    abstract actions: ActionsType<State, Actions>;
    abstract view: (props: this['props'], state: State, actions: Actions) => JSX.Element | null;
    ctx: {
        actions: Actions;
        state: State;
    };
    state: {
        state: State;
    };
    constructor(props: any);
    componentWillMount(): void;
    render(): JSX.Element | null;
}
export interface Options {
    raf?: boolean;
    debug?: boolean;
}
export default function withPreact<State, Actions>(container?: Element, options?: Options): (app: App<State, Actions>) => App<State, Actions>;
