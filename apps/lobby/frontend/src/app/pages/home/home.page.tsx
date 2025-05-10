import { Button, ButtonVariants } from '@shared/ui/components/buttons';
import { SiteMap } from '../../components/site-map';
import { useAppSelector } from '../../redux/hooks';

export const HomePage = () => {
  const { data } = useAppSelector((state) => state.user);

  return (
    <div>
      <h1
        style={{
          fontSize: '4rem',
          fontWeight: 600,
        }}
      >
        Welcome {data?.email}
      </h1>

      <SiteMap />
    </div>
  );
};
