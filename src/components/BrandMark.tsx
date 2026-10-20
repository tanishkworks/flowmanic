import Image from 'next/image';

interface BrandMarkProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function BrandMark({ className = '', style }: BrandMarkProps) {
  return (
    <Image
      src="/flowmanic-logo.png"
      alt="Flowmanic"
      width={296}
      height={95}
      className={`brand-logo ${className}`}
      priority
      style={{
        height: '32px',
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
    />
  );
}
