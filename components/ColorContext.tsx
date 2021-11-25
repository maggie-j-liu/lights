import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode,
  useContext,
} from "react";

export interface Color {
  r: number;
  g: number;
  b: number;
}
const ColorContext = createContext<{
  color: Color;
  setColor: Dispatch<SetStateAction<Color>> | Function;
}>({
  color: { r: 0, g: 0, b: 0 },
  setColor: () => {},
});
export const ColorContextProvider = ({ children }: { children: ReactNode }) => {
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  );
};

const useColor = () => useContext(ColorContext);
export default useColor;
