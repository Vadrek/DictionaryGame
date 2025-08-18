import { FC, PropsWithChildren } from 'react';

export const StepContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-0 items-center gap-6 p-6 ml-6 mr-6 mt-6 bg-gradient-to-b from-purple-900 to-black rounded-lg shadow-lg">
      {children}
    </div>
  );
};
