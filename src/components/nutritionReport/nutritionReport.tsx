import React from 'react';

import LockPage from '../lockPage/lockPage';
import NutritionCard from './nutritionCard';
import NutritionGraph from './nutritionGraph';
import TopAppBar from '../topAppBar/topAppBar';
import { getAllFoods, getFood } from '../../api/foods';
import { getMealByDays, postMeal, patchMeal, deleteMeal } from '../../api/meals';
import { getRestaurants, getRestaurant } from '../../api/restaurants';
import { getReviews, postReview, patchReview, deleteReview } from '../../api/reviews';


import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Box from '@mui/material/Box';
import DatePicker from '@mui/lab/DatePicker';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';

import './styles.css';

interface NutritionReportProps extends PropsFromRedux {};
interface NutritionReportStates {
  nutrientGraphed: string;
  reportDate: Date;
  historyStartDate: Date;
  historyEndDate: Date;
};

interface NutritionStats {
  [x: string]: [number, number, string];
}

// TODO: create a function that retrieves this data on a certain day
const nutritionStats: NutritionStats = {
  'Calories': [1800, 2300, 'cal'],
  'Sugar': [28, 36, 'g'],
  'Salt': [8, 6, 'g'],
  'Calcium': [1000, 2500, 'mg'],
  'Sodium': [2500, 3400, 'mg'],
  'Vitamin A': [1000, 900, 'mg'],
  'Vitamin B-12': [1.1, 2.4, 'mg'],
  'Vitamin C': [78, 80, 'mg'],
  'Fat': [20, 50, 'g'],
  'Carbohydrates': [240, 300, 'g'],
  'Protein': [44, 50, 'g'],
  'Water': [0, 8, 'cups'],
}

class NutritionReport extends React.Component<NutritionReportProps, NutritionReportStates>{
  constructor(props: NutritionReportProps) {
    super(props);
    this.state = {
      nutrientGraphed: 'Calories',
      reportDate: new Date(),
      historyStartDate: new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000)),
      historyEndDate: new Date(),
    }
  }

  async componentDidMount() {
    /*
    * Instructions for testing API:
    * Uncomment each line ONE BY ONE to test whether a specific route works
    * Follow comments at the end of each line
    */
    const { userId, token } = this.props;
    if (this.props.loggedIn) {
      // console.log(await getAllFoods(token));
      // console.log(await getFood('616ad598d252dea11b903acc', token));
      // console.log(await getMealByDays('6168ce2fe182727b2d0cfe17', token, [])); // DOESN'T WORK
      // console.log(await postMeal('616cbb83970499fbab480854', [
      //    "616ad598d252dea11b903acb",
      //    "616ad598d252dea11b903acc"
      // ], token));
      // console.log(await patchMeal('6180b1d843d930001c5b5d56', ["616ad598d252dea11b903acb", "616ad598d252dea11b903acd"], token)); // Replace first argument with your meal id
      // console.log(await deleteMeal('6180b1d843d930001c5b5d56', token)); // Replace first argument with your meal id
      // console.log(await getRestaurants(token));
      // console.log(await getRestaurant('616ad5d0d252dea11b9043c5', token));
      // console.log(await postReview(userId!, '616ad5d0d252dea11b9043c5', 'test review', 5, true, token)); // Replace second argument with your review id
      // console.log(await getReviews('616ad5d0d252dea11b9043c5', token)); // DOESN'T WORK
      // console.log(await patchReview('6180b32e43d930001c5b5d5d', 'another test review', 3, true, token)); // Replace first argument with your review id
      // console.log(await deleteReview('6180b32e43d930001c5b5d5d', token));
    }
  }

  render() {
    const {
      nutrientGraphed,
      reportDate,
      historyStartDate,
      historyEndDate,
    } = this.state;
    const DV = nutritionStats[nutrientGraphed][1];
    const unit = nutritionStats[nutrientGraphed][2];
    return (
        <Box mx={2}>
          <TopAppBar page='nutrition report'/>
          {this.props.loggedIn?
          <>
            <Grid container mt={15}>
              <Grid item xs={6}>
                <div className='title'>Daily Nutrition Report</div>
              </Grid>
              <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label='Date'
                    value={reportDate}
                    maxDate={new Date()}
                    onChange={(newDate: Date | null) => {
                      this.setState({reportDate: newDate? newDate : new Date()})
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Divider variant='middle'/>
            <Grid container justifyContent='center'>
              {Object.keys(nutritionStats).map((key: string) => {
                const [intake, DV, unit] = nutritionStats[key];
                return (<Grid item xs={2}>
                  <NutritionCard nutrient={key} currentStats={intake} DV={DV} unit={unit} date={reportDate}/>
                </Grid>)
              })}
            </Grid>
            <Grid container mt={2}>
              <Grid item xs={6}>
                <div className='title'>Nutrition History</div>
              </Grid>
              <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label='Start Date'
                    value={historyStartDate}
                    maxDate={new Date()}
                    onChange={(newDate: Date | null) => {
                      this.setState({
                        historyStartDate: newDate? newDate : new Date(),
                        historyEndDate: newDate && newDate > historyEndDate? newDate : historyEndDate,
                      })
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DatePicker
                    label='End Date'
                    value={historyEndDate}
                    maxDate={new Date()}
                    onChange={(newDate: Date | null) => {
                      this.setState({
                        historyEndDate: newDate? newDate : new Date(),
                        historyStartDate: newDate && newDate < historyStartDate? newDate : historyStartDate,
                      })
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Divider variant='middle'/>
            <Grid container justifyContent='left' alignItems='left'>
              <Tabs
                variant='scrollable'
                scrollButtons={true}
                onChange={(event, value) => this.setState({nutrientGraphed: value})}
                value={nutrientGraphed}
              >
                {Object.keys(nutritionStats).map((key: string) => {
                  return (<Tab
                      value={key}
                      label={key}
                      wrapped
                      sx={{
                        fontSize: 15,
                      }}
                  />)
                })}
              </Tabs>
            </Grid>
            <NutritionGraph nutrient={nutrientGraphed} startDate={historyStartDate} endDate={historyEndDate} DV={DV} unit={unit}/>
          </>: <LockPage/>}
        </Box>
    );
  }
}

const mapStateToProps = (state: State) => ({
  loggedIn: state.logIn.loggedIn,
  token: state.logIn.token,
  userId: state.logIn.userId,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(NutritionReport);