interface LoginScreenProps {
  onJoin: (nickname: string) => void;
}

export default function LoginScreen({
  onJoin,
}: LoginScreenProps) {
  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const nickname = String(
      formData.get("nickname")
    ).trim();

    if (!nickname) return;

    onJoin(nickname);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4">
          Real-Time Chat
        </h1>

        <input
          name="nickname"
          placeholder="Enter nickname"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white p-2 rounded"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
}