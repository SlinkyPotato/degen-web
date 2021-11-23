import { Button } from '@chakra-ui/react';

export default function Header() {
  return (
    <div className="container px-3 py-4 mx-auto flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-500 mr-3"></div>
      <Button variant="ghost">Home</Button>
      <span className="flex-grow"></span>
      <Button>Login</Button>
    </div>
  );
}
