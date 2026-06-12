interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="h-screen bg-white p-4">
      <div className="h-full w-full border border-[#B7D3FF] rounded-lg overflow-hidden grid grid-cols-2">
        {/* Left Panel */}
        <div className="bg-[#F4F7FB] flex items-center justify-center">
          <img
            src="/illustration.svg"
            alt="Illustration"
            className="w-[650px] max-w-[80%]"
          />
        </div>

        {/* Right Panel */}
        <div className="bg-white flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;