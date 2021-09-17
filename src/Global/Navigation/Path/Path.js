import Breadcrumbs from 'nextjs-breadcrumbs';
const Path = () => {
  const changeLabel = (title) => {
    switch (title) {
      case 'Home':
        return 'خانه';

      case 'test':
        return 'تست';

      default:
        return title;
    }
  };

  return (
    <Breadcrumbs
      rootLabel="Home"
      transformLabel={changeLabel}
      listClassName="breadcrumb m-0"
      inactiveItemClassName="breadcrumb-item"
      activeItemClassName="breadcrumb-item active"
    />
  );
};

export default Path;
