import { Styled } from 'direflow-component';
import React, { FC, useRef } from 'react';
import chunk from 'lodash/chunk';
import zip from 'lodash/zip';
import SearchStore from '../../../../stores/SearchStore';
import AnimeCard from './AnimeCard';
import styles from './SearchResultsGrid.less';
import AnimeSearchResultModel from '../../../../models/AnimeSearchResultModel';
import useElementSize from '../../../../hooks/useElementSize';

const CARD_WIDTH_IN_PIXELS = 288; // 18rem
const COLUMN_GAP_IN_PIXELS = 16; // 1rem

function getColumnCount(elementWidth: number) {
  return Math.max(
    Math.floor(elementWidth / (CARD_WIDTH_IN_PIXELS + COLUMN_GAP_IN_PIXELS)),
    1
  );
}

function renderGrid(items: AnimeSearchResultModel[], columnCount: number) {
  const rows = chunk(items, columnCount);
  const columns = zip(...rows);

  return columns.map((rows, index) => (
    <div key={index} className="grid-column">
      {rows.map((item) => item && <AnimeCard key={item.id} {...item} />)}
    </div>
  ));
}

const SearchResultsGrid: FC = () => {
  const { items, loading } = SearchStore.useState((s) => s.results);
  const resultsGridElement = useRef<HTMLDivElement>(null);
  const [width] = useElementSize(resultsGridElement.current);
  const columnCount = getColumnCount(width);

  const gridTemplateColumns = `repeat(${columnCount}, 18rem)`;

  // TODO: Replace loading message for skeleton loader

  return (
    <Styled styles={styles}>
      <div
        ref={resultsGridElement}
        className="search-results-grid"
        style={{ gridTemplateColumns }}
      >
        {loading && items.length === 0 && <p>Loading...</p>}
        {width && renderGrid(items, columnCount)}
      </div>
    </Styled>
  );
};

export default SearchResultsGrid;
