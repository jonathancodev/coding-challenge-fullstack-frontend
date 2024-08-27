import PropTypes from 'prop-types';
import Pagination from '@mui/material/Pagination';
import { Grid, MenuItem, TextField } from '@mui/material';

CustomPagination.propTypes = {
  onChangePage: PropTypes.func,
  onChangeLimit: PropTypes.func,
  paginationConfig: PropTypes.object
};

export default function CustomPagination({onChangePage, onChangeLimit, paginationConfig}) {

  const rangePages = Array.from(Array(paginationConfig.pages).keys());
  rangePages.shift();
  rangePages.push(paginationConfig.pages);

  const limits = [
    {
      value: 10,
      label: '10'
    },
    {
      value: 25,
      label: '25'
    },
    {
      value: 50,
      label: '50'
    },
    {
      value: 100,
      label: '100'
    }
  ];

  return (
    <Grid sx={{ textAlign: 'center', padding: '20px' }} gridRow={2}>
      <Grid item xs={12} gridRow={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <span style={{ paddingRight: '5px' }}>{'Showing '}</span>
        <TextField
          select
          size='small'
          label=''
          value={paginationConfig.limit}
          onChange={onChangeLimit}
        >
          {limits.map(lt => {
              return (
                <MenuItem key={lt.value} value={lt.value}>{lt.label}</MenuItem>
              )
            })
          }
        </TextField>
        <span style={{ paddingLeft: '5px' }}>{` items of ${paginationConfig.total}`}</span>
      </Grid>

      <Grid item xs={12} gridRow={2} style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
        <Pagination 
          count={paginationConfig.pages} 
          defaultPage={1} 
          page={paginationConfig.page} 
          boundaryCount={2}
          onChange={onChangePage}
        />
      </Grid>

      {rangePages && 
        <Grid item xs={12} gridRow={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ paddingRight: '5px' }}>{'Go to page '}</span>
          <TextField
            select
            size='small'
            label=''
            value={paginationConfig.page}
            onChange={(e) => onChangePage(e, +e.target.value)}
          >
            {rangePages.map(p => {
                return (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                )
              })
            }
          </TextField>
        </Grid>
      }
    </Grid>
  );
}
