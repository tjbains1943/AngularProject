import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import {DATA} from "../../mock-tasks";
import { Task } from '../../Task';


// TODO: replace this with real data from your application
/**
 * Data source for the TableComponent view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableComponentDataSource extends DataSource<Task> {
  data: Task[] = DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter: string;
  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Task[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Task[]): Task[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Task[]): Task[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    const convertTime = (dateString) => {
      const currentDate = new Date(dateString);
      return currentDate.getTime()
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'division': return compare(a.division, b.division, isAsc);
        case 'project_owner': return compare(a.project_owner, b.project_owner, isAsc);
        case 'budget': return compare(+a.budget, +b.budget, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        case 'created': return compare(convertTime(a.created), convertTime(b.created), isAsc);
        case 'modified': return compare(convertTime(a.modified), convertTime(b.modified), isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
