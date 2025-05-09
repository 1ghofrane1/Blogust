import Featured from '@/components/featured/Featured';
import styles from './page.module.css';
import CardList from '@/components/cardList/CardList';
import CategoryList from '@/components/categoryList/CategoryList';
import Menu from '@/components/menu/Menu';

export default function Home({searchParams}) {
  const cat = searchParams.cat;
  const page = parseInt(searchParams.page) || 1;
  return (
<div className={styles.container}>
    
    <CategoryList/>
    <div className={styles.content}>
      <CardList page={page} cat={cat}/>
      <Menu/>
    </div>
</div>);
}