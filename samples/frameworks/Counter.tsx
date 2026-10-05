import { useEffect as effect, useState as state } from 'react';

export function Counter() {
    const [count, setCount] = state(0);
    effect(() => {
        document.title = `Count: ${count}`;
    }, [count]);

    // This text is not executable: if throw return {
    return <CounterButton onClick={() => setCount(value => value + 1)}>
        Count: {count}
    </CounterButton>;
}

function CounterButton(props: { onClick: () => void; children: React.ReactNode }) {
    return <button onClick={props.onClick}>{props.children}</button>;
}

function unrelated(state: (value: number) => void) {
    state(1); // A shadowed parameter, not the imported hook.
}
