import { Button } from '../buttons/buttons';

type Props = {
  inputUsername: string;
  setInputUsername: (username: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
};

export const UsernameForm = ({
  inputUsername,
  setInputUsername,
  handleSubmit,
  disabled,
}: Props) => {
  return (
    <div className="h-fit">
      <form
        onSubmit={handleSubmit}
        className="flex gap-4 items-center w-full overflow-hidden"
      >
        <input
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          className="flex-1 min-w-0 px-4 py-2 rounded-lg border-4 border-black bg-gradient-to-b from-purple-600 to-purple-800 font-bold text-white focus:outline-none focus:border-yellow-400"
          placeholder="Votre pseudo"
          maxLength={10}
        />
        <Button disabled={disabled} type="submit">
          Changer
        </Button>
      </form>
    </div>
  );
};
