import React from 'react'

const Eye = ({className}: {className?: string}) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} >
      <path d="M10 8C10 8.53043 9.78929 9.03914 9.41421 9.41421C9.03914 9.78929 8.53043 10 8 10C7.46957 10 6.96086 9.78929 6.58579 9.41421C6.21071 9.03914 6 8.53043 6 8C6 7.46957 6.21071 6.96086 6.58579 6.58579C6.96086 6.21071 7.46957 6 8 6C8.53043 6 9.03914 6.21071 9.41421 6.58579C9.78929 6.96086 10 7.46957 10 8Z" stroke="#64717C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.33203 8.00065C2.3987 5.26932 4.88936 3.33398 7.9987 3.33398C11.108 3.33398 13.5987 5.26932 14.6654 8.00065C13.5987 10.732 11.108 12.6673 7.9987 12.6673C4.88936 12.6673 2.3987 10.732 1.33203 8.00065Z" stroke="#64717C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  )
}

export default Eye