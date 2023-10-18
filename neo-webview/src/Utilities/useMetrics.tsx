import { useState } from "react";

export type metrics = {
  name?: string,
  data?: number[],
  score?: number,
  color?: string,
  number?: number
};

export type SetMetrics = React.Dispatch<React.SetStateAction<metrics>>;

export function useMetrics(initialState: metrics = {
  name: '',
  data: [],
  score: 0,
  color: 'white',
  number: 0
}): [metrics, SetMetrics] {

  const [metrics, setMetrics] = useState(initialState)

  return [metrics, setMetrics];
}

