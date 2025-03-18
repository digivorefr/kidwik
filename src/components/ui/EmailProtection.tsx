'use client';

interface EmailProtectionProps {
  emailUser: string;
  emailDomain: string;
}

export default function EmailProtection({ emailUser, emailDomain }: EmailProtectionProps) {
  const handleClick = () => {
    window.location.href = `mailto:${emailUser}@${emailDomain}`;
  };

  return (
    <button 
      onClick={handleClick}
      className="text-[var(--kiwi-darker)] font-medium hover:underline inline-block"
      aria-label="Nous contacter"
    >
      {emailUser}[at]{emailDomain}
    </button>
  );
}