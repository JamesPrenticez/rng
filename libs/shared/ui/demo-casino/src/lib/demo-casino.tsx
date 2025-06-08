import styled from '@emotion/styled';
import { type FormEvent, useMemo, useState } from 'react';
import clsx from 'clsx';
import type { APP, GAME } from '@shared/models';
import { useAspectRatio } from '@shared/hooks';
import { getSessionUrl } from './get-session-url';
import { createRandomUsername, CURRENCIES, CURRENCY_MAP } from '@shared/utils';
import { Button, ButtonVariants, Input, Select } from '@shared/components'

const HEADER_HEIGHT = 60;

const MIN = `
            min(calc(100vw - ${HEADER_HEIGHT * 2}px),
            calc(177vh - ${HEADER_HEIGHT * 4}px))`;

const Container = styled.div`
  box-sizing: border-box;

  background-color: #09090a;
  border: lime 1px solid;
  height: 100dvh;

  overflow: hidden;

  form {
    margin-left: 2rem;
    display: flex;
    gap: 2rem;

    fieldset {
      display: flex;
      gap: 2rem;
    }
  }

  iframe {
    box-sizing: border-box;
    margin: 40px;
    width: ${MIN};
    height: calc((1080 / 1920) * ${MIN});
  }

  .currency-symbol {
    font-size: 3rem;
    display: flex;
    align-items: center;
    margin-right: -1rem;
  }

  &.moible {
    iframe {
      margin: 0px;
      box-sizing: border-box;
      width: 100dvw;
      height: 100dvh;
    }
  }
`;

// Replace with Title?
const Header = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100vw;
  height: ${HEADER_HEIGHT}px;
  font-size: 4rem;
  font-family: 'Aronui';
  color: var(--color-primary);
  background-color: var(--color-black-20);
  border-bottom: silver 1px solid;

  padding: 0rem 1rem;

  &.mobile {
    align-items: center;
    justify-content: center;
    padding: 0px 10px;
  }
`;

const SubmitButton = styled(Button)`
  && {
    border-color: rgba(var(--color-rag-green-opacity), 0.7);
    :hover {
      background-color: rgba(var(--color-rag-green-opacity), 1);
    }
  }
`

interface DemoCasinoProps {
  app: APP | GAME;
}

export const DemoCasino = ({ app }: DemoCasinoProps) => {
  const isMobile = useAspectRatio();
  // const [gameUrl, setGameUrl] = useState('http://localhost:4202/'); // TODO update for different apps
  const [gameUrl, setGameUrl] = useState(
      localStorage.getItem(`${app}_demo_casino_url`)
  );

  const randomName = () => {
    setForm((p) => ({ ...p, username: createRandomUsername() }));
  };

  const [form, setForm] = useState<{
    username: string;
    credits: number;
    currency: string;
    nicknamePrompt: boolean;
  }>({
    username:
      localStorage.getItem(`${app}_demo_casino_username`) ||
      createRandomUsername(2, 999),
    credits: 10000,
    currency: 'USD',
    nicknamePrompt: false,
  });

  const updateUser = (e: FormEvent) => {
    e.preventDefault();
    const data = getSessionUrl(
      form.username,
      form.credits,
      form.currency,
      form.nicknamePrompt
    );
    localStorage.setItem(`${app}_demo_casino_url`, data.url);
    localStorage.setItem(`${app}_demo_casino_session`, data.token);
    localStorage.setItem(`${app}_demo_casino_username`, form.username);

    setGameUrl(data.url);
  };

  const updateForm = (
    field: 'username' | 'credits' | 'currency' | 'nicknamePrompt'
  ) => {
    const getValue = (target: HTMLInputElement | HTMLSelectElement) => {
      switch (field) {
        case 'username':
        case 'currency':
          return target.value;
        case 'credits':
          return +target.value;
        case 'nicknamePrompt':
          return true;
      }
    };
    return (e: FormEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (field !== 'nicknamePrompt') e.preventDefault();

      const value = getValue(e.currentTarget);

      setForm((prev) => {
        return {
          ...prev,
          [field]: field === 'nicknamePrompt' ? !prev.nicknamePrompt : value,
        };
      });
    };
  };

  const symbol = useMemo(() => {
    return CURRENCY_MAP[form.currency as keyof typeof CURRENCY_MAP].symbol;
  }, [form.currency]);

  console.log(gameUrl)
  return (
    <Container className={clsx({ mobile: isMobile })}>
      <Header>
        Demo Casino

        <form onSubmit={updateUser}>
          <fieldset>
            <Input
              type="text"
              placeholder="username"
              value={form.username}
              onChange={updateForm('username')}
            />
            <Button className={'random-name'} onClick={randomName}>
              ?
            </Button> 
          </fieldset>
          
          <fieldset>
            <div className="currency-symbol">{symbol}</div>
            <Input
              type="number"
              step={500}
              placeholder="credits"
              value={form.credits}
              onChange={updateForm('credits')}
            />
          </fieldset>

<fieldset>
          <Select 
            value={form.currency} onChange={updateForm('currency')}
            >
            {CURRENCIES.map((cur) => (
              <option key={cur.value} value={cur.value} label={cur.label} />
            ))}
          </Select>
            </fieldset>
          <SubmitButton 
            type="submit"
            value="Update"
            variant={ButtonVariants.FILLED}
          > 
            Update
          </SubmitButton> 
        </form>
      </Header>
      {gameUrl && <iframe src={gameUrl} title="Game Studio" />}
    </Container>
  );
};
