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
export interface AllColors extends Color {
  rainbow: boolean;
}

const ColorContext = createContext<{
  color: AllColors;
  setColor: Dispatch<SetStateAction<AllColors>> | Function;
}>({
  color: { r: 0, g: 0, b: 0, rainbow: false },
  setColor: () => {},
});
export const ColorContextProvider = ({ children }: { children: ReactNode }) => {
  const [color, setColor] = useState({ r: 0, g: 0, b: 0, rainbow: false });
  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  );
};

const useColor = () => useContext(ColorContext);
export default useColor;
