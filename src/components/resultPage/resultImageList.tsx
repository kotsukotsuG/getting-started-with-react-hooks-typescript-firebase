import React, { FC, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import firebase from '../../firebase';
import { TileDate } from '../../types/types';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      width: '80%',
      textAlign: 'center',
      marginTop: '2%',
    },
    titleImage: {
      height: '218px',
      width: '218px',
    },
  })
);

const ImageItemList: FC = () => {
  const [data, setData] = useState<TileDate[]>([]);
  const { keyword } = useParams();
  const classes = useStyles();
  const history = useHistory();

  const getData = async (searchWord: string | undefined) => {
    const db = firebase.firestore();
    const tileDateRef = db.collection('tileDate');
    const searchedData = tileDateRef.where(
      'keyword',
      'array-contains',
      searchWord
    );
    const snapShot = await searchedData.get();
    const temporaryData: TileDate[] = [];

    snapShot.docs.map((doc: any) => {
      return temporaryData.push(doc.data());
    });
    setData(temporaryData);
  };

  useEffect(() => {
    getData(keyword);
  }, []);

  return (
    <div>
      <p>もしかしてきてる？</p>
      {data.map((title) => (
        <div className={classes.root}>
          <Button onClick={() => history.push(`/download/${title.title}`)}>
            <img
              className={classes.titleImage}
              src={title.image}
              alt={title.title}
            />
          </Button>
          <h3>{title.title}</h3>
        </div>
      ))}
    </div>
  );
};
export default ImageItemList;
