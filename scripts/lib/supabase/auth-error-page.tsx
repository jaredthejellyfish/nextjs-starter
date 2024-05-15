import React from 'react';

type Props = {
  searchParams: { message: string | undefined };
};

function AuthErrorPage({ searchParams: { message } }: Props) {
  return <div>AuthErrorPage {message}</div>;
}

export default AuthErrorPage;
