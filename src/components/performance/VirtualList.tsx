'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { List } from 'antd';

interface VirtualListProps<T> {
  data: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  data,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      data.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return {
      startIndex,
      endIndex,
      items: data.slice(startIndex, endIndex + 1),
    };
  }, [data, itemHeight, containerHeight, scrollTop, overscan]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = data.length * itemHeight;
  const offsetY = visibleItems.startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height: containerHeight,
        overflow: 'auto',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.items.map((item, index) => (
            <div
              key={visibleItems.startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleItems.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Ant Design List 的虚拟化版本
interface VirtualAntdListProps<T> extends Omit<React.ComponentProps<typeof List>, 'dataSource' | 'renderItem'> {
  data: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export function VirtualAntdList<T>({
  data,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  ...listProps
}: VirtualAntdListProps<T>) {
  return (
    <VirtualList
      data={data}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      overscan={overscan}
      renderItem={(item, index) => (
        <List.Item key={index}>
          {renderItem(item, index)}
        </List.Item>
      )}
      {...listProps}
    />
  );
}