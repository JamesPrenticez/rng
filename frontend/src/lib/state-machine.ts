import { v4 as uuid } from 'uuid';

export type StateChangeCbFn<T extends string, K> = (
    prevState: T,
    newState: T,
    prevData: K,
    newData: K
) => void;

export interface IStateMachineState<T, K extends string> {
    update: (
        previousState: T,
        newState: T,
        currentState: K,
        nextState: K
    ) => K | null;
    name: K;
    interrupt?: boolean; // If this state can interupt at any point
}

export interface IStateMachine<T, K extends string> {
    update: (state: Partial<T>) => void;

    getData: () => T;
    getState: () => IStateMachineState<T, K> | null;

    onStateChange: (callback: StateChangeCbFn<K, T>) => { remove: () => void };
}

const getInterruptState = <T, K extends string>(
    states: IStateMachineState<T, K>[],
    previousState: T,
    newState: T,
    currentState: K,
    nextState: K
) => {
    const interrupts = states.filter((s) => s.interrupt);

    if (interrupts.length > 0) {
        for (const interrupt of interrupts) {
            const result = interrupt.update(
                previousState,
                newState,
                currentState,
                nextState
            );
            if (result !== null) return result;
        }
    }

    return null;
};

export const StateMachine = <T, K extends string>(
    data: T,
    states: IStateMachineState<T, K>[],
    initialState: K,
    stringify = false
): IStateMachine<T, K> => {
    const findState = (name: K) => {
        return states.find((s) => s.name === name) || null;
    };

    const ctx: {
        data: T;
        state: IStateMachineState<T, K> | null;
        wasInterrupted: boolean;
        interruptState: { previous: K | null; current: K | null } | null;
        callbacks: Map<string, StateChangeCbFn<K, T>>;
    } = {
        data,
        state: findState(initialState),
        wasInterrupted: false,
        interruptState: null,
        callbacks: new Map<string, StateChangeCbFn<K, T>>(),
    };

    const update = (partialData: Partial<T>) => {
        const previous = stringify
            ? JSON.parse(JSON.stringify({ ...ctx.data }))
            : { ...ctx.data };

        ctx.data = stringify
            ? JSON.parse(JSON.stringify({ ...ctx.data, ...partialData }))
            : { ...ctx.data, ...partialData };

        if (ctx.state) {
            let currentState = ctx.state.name;
            let resuming = false;

            // Check interupts

            let nextState = ctx.state.update(
                previous,
                ctx.data,
                ctx.state.name,
                '' as K
            );

            const interruptState = getInterruptState(
                states,
                previous,
                ctx.data,
                ctx.state.name,
                nextState as K
            );

            if (interruptState && interruptState === currentState) return;

            if (interruptState && !ctx.wasInterrupted) {
                ctx.wasInterrupted = true;
                ctx.interruptState = {
                    previous: currentState,
                    current: nextState,
                };
            }

            if (ctx.wasInterrupted && !interruptState) {
                if (ctx.interruptState) {
                    nextState = ctx.interruptState?.current;
                    currentState = ctx.interruptState?.previous || currentState;
                    ctx.interruptState = null;
                    resuming = true;
                }
                ctx.wasInterrupted = false;
            }

            if (interruptState) {
                nextState = interruptState;
            }

            if (nextState && (currentState !== nextState || resuming)) {
                const newState = findState(nextState);

                if (!newState) {
                    // Error state doesn't exist
                    return;
                }

                ctx.state = newState;

                console.log('State change', currentState, newState.name);

                // Emit state change
                ctx.callbacks.forEach((cb) => {
                    cb(
                        currentState,
                        newState.name,
                        { ...previous },
                        { ...ctx.data }
                    );
                });
            }
        }
    };

    const onStateChange = (cb: StateChangeCbFn<K, T>) => {
        const id = uuid();

        ctx.callbacks.set(id, cb);

        if (ctx.state)
            ctx.state.update(
                ctx.data,
                ctx.data,
                ctx.state.name,
                ctx.state.name
            );

        return {
            remove: () => ctx.callbacks.delete(id),
        };
    };

    return {
        update,
        getState: () => ctx.state,
        getData: () => ctx.data,

        onStateChange,
    };
};
