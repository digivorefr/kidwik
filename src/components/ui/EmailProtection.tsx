'use client';

import { Button } from './Button';

interface EmailProtectionProps {
  emailUser: string;
  emailDomain: string;
}

export default function EmailProtection({ emailUser, emailDomain }: EmailProtectionProps) {
  const handleClick = () => {
    window.location.href = `mailto:${emailUser}@${emailDomain}`;
  };

  return (
    <Button
      onClick={handleClick}
      variant="text"
      aria-label="Nous contacter"
      className="font-medium text-[var(--kiwi-darker)]"
    >
      {emailUser}[at]{emailDomain}
    </Button>
  );
}