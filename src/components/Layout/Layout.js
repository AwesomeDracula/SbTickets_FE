import React, { useEffect } from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";
import { Box, IconButton, Link } from '@material-ui/core';
import Icon from '@mdi/react';
import { ToastContainer, toast } from "react-toastify";

//icons
import {
  mdiFacebook as FacebookIcon,
  mdiTwitter as TwitterIcon,
  mdiGithub as GithubIcon,
} from '@mdi/js'

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Tables from "../../pages/tables";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";
import Drivers from "../../pages/Drivers";

// context
import { useLayoutState } from "../../context/LayoutContext";
import DriverDetail from "../../pages/Drivers/DriverDetail";
import NewDriver from "../../pages/Drivers/NewDriver";
import Bus from "../../pages/Bus";
import BusDetail from "../../pages/Bus/BusDetail";
import NewBus from "../../pages/Bus/NewBus";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  const notifyError = (message) => toast.error(message);

  const notifySuccess = (message) => toast.success(message);

  useEffect(() => {
    if (layoutState.showToastSuccess) {
      notifySuccess(layoutState.message);
    }
  }, [layoutState.showToastSuccess]);

  useEffect(() => {
    if (layoutState.showToastFail) {
      notifyError(layoutState.message);
    }
  }, [layoutState.showToastFail]);

  return (
    <div className={classes.root}>
      <>
        <ToastContainer />
        <Header history={props.history} />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route path="/app/dashboard" component={Dashboard} />
            <Route path="/app/typography" component={Typography} />
            <Route path="/app/tables" component={Tables} />
            <Route path="/app/notifications" component={Notifications} />
            <Route
              exact
              path="/app/ui"
              render={() => <Redirect to="/app/ui/icons" />}
            />
            <Route exact path="/app/drivers" component={Drivers} />
            <Route exact path="/app/drivers/create" component={NewDriver} />
            <Route exact path="/app/drivers/:id" component={DriverDetail} />
            <Route exact path="/app/bus" component={Bus} />
            <Route exact path="/app/bus/create" component={NewBus} />
            <Route exact path="/app/bus/:id" component={BusDetail} />
            <Route path="/app/ui/maps" component={Maps} />
            <Route path="/app/ui/icons" component={Icons} />
            <Route path="/app/ui/charts" component={Charts} />
          </Switch>
          <Box
            mt={5}
            width={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <div>
              <Link
                color={'primary'}
                href={'https://github.com/AwesomeDracula/SbTickets_BE'}
                target={'_blank'}
                className={classes.link}
              >
                Project Backend
              </Link>
              <Link
                color={'primary'}
                href={'https://github.com/AwesomeDracula/SbTickets_FE'}
                target={'_blank'}
                className={classes.link}
              >
                Project Frontend
              </Link>
            </div>
            <div>
              <Link
                href={'https://www.facebook.com/groups/371157724565461'}
                target={'_blank'}
              >
                <IconButton aria-label="facebook">
                  <Icon
                    path={FacebookIcon}
                    size={1}
                    color="#6E6E6E99"
                  />
                </IconButton>
              </Link>
              <Link
                href={'https://github.com/AwesomeDracula/'}
                target={'_blank'}
              >
                <IconButton
                  aria-label="github"
                  style={{ marginRight: -12 }}
                >
                  <Icon
                    path={GithubIcon}
                    size={1}
                    color="#6E6E6E99"
                  />
                </IconButton>
              </Link>
            </div>
          </Box>
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
