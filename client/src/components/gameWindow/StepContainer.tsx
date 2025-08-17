import { FC, PropsWithChildren } from 'react';

export const StepContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col items-center gap-6 p-6 m-6 bg-gradient-to-b from-purple-900 to-black rounded-lg shadow-lg">
      {children}
    </div>
  );
};
