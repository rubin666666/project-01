'use client';

import { useEffect, useMemo, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import styles from '@/src/components/Filters/Filters.module.css';

function FilterInput({
  items,
  placeholder,
  selectedValue,
  onSelect,
  disabled,
}) {
  const selectedItem = items.find(
    item => (typeof item === 'string' ? item : item._id) === selectedValue
  );
  const selectedName =
    typeof selectedItem === 'string' ? selectedItem : selectedItem?.name || '';
  const [input, setInput] = useState(selectedName);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setInput(selectedName);
  }, [selectedName]);

  const filteredItems = useMemo(
    () =>
      items.filter(item => {
        const name = typeof item === 'string' ? item : item.name;
        return name?.toLowerCase().includes(input.toLowerCase());
      }),
    [input, items]
  );

  const reset = () => {
    setInput('');
    setOpen(false);
    onSelect('');
  };

  return (
    <div className={styles.filterGroup}>
      <div className={styles.selectWrapper}>
        <input
          className={styles.select}
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={event => {
            setInput(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
          autoComplete="off"
          disabled={disabled}
        />
        {!input ? (
          <svg
            className={styles.selectArrow}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 8L10 13L15 8"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <button
            type="button"
            className={styles.resetInputFilterBtn}
            onMouseDown={event => event.preventDefault()}
            onClick={reset}
            aria-label={`Reset ${placeholder}`}
          >
            <IoMdCloseCircleOutline className={styles.resetInputIcon} />
          </button>
        )}
        {open && filteredItems.length > 0 && (
          <ul className={styles.dropdown}>
            {filteredItems.map(item => {
              const value = typeof item === 'string' ? item : item._id;
              const name = typeof item === 'string' ? item : item.name;
              return (
                <li key={value}>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => {
                      setInput(name);
                      setOpen(false);
                      onSelect(value);
                    }}
                  >
                    {name}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function FilterControls({
  totalItems,
  loading,
  category,
  ingredient,
  categories,
  ingredients,
  filtersLoading,
  onCategoryChange,
  onIngredientChange,
  onReset,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderFields = keyPrefix => (
    <div key={keyPrefix} style={{ display: 'contents' }}>
      <FilterInput
        key={`${keyPrefix}-category`}
        items={categories}
        placeholder="Category"
        selectedValue={category}
        onSelect={onCategoryChange}
        disabled={filtersLoading}
      />
      <FilterInput
        key={`${keyPrefix}-ingredient`}
        items={ingredients}
        placeholder="Ingredients"
        selectedValue={ingredient}
        onSelect={onIngredientChange}
        disabled={filtersLoading}
      />
    </div>
  );

  return (
    <>
      <span className={styles.recipesCount}>
        {loading
          ? 'Searching...'
          : totalItems > 0
            ? `${totalItems} recipes`
            : 'No recipes'}
      </span>
      <div className={styles.mobFilter}>
        <button
          type="button"
          className={styles.mobFilterBtn}
          onClick={() => setMobileOpen(value => !value)}
        >
          Filters
          {mobileOpen ? (
            <IoMdCloseCircleOutline className={styles.filterIcon} />
          ) : (
            <FiFilter className={styles.filterIcon} />
          )}
        </button>
        <div
          className={`${styles.mobMenu} ${
            mobileOpen ? styles.mobMenuOpen : ''
          }`}
        >
          {renderFields('mobile')}
          <button type="button" onClick={onReset} className={styles.resetButton}>
            Reset filters
          </button>
        </div>
      </div>
      <div className={styles.pcFilter}>
        <button type="button" onClick={onReset} className={styles.resetButton}>
          Reset filters
        </button>
        {renderFields('desktop')}
      </div>
    </>
  );
}
