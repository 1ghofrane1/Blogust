import Featured from '@/components/featured/Featured';
import styles from './page.module.css';
import CardList from '@/components/cardList/CardList';
import CategoryList from '@/components/categoryList/CategoryList';
import Menu from '@/components/menu/Menu';

export default function Home() {
  return (
<div>
    <Featured/>
    <CategoryList/>
    <div className={styles.container}>
      <CardList/>
      <Menu/>
    </div>
</div>);
}
