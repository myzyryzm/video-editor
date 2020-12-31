/** @format */

import React, { useState } from 'react'
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import EditIcon from '@material-ui/icons/Edit'
import Paper from '@material-ui/core/Paper'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideoPlayer from '../VideoPlayer/VideoPlayer'
import TrimPanel from './TrimPanel'

const tabsTheme = createMuiTheme({
    overrides: {
        MuiTabs: {
            fixed: {
                overflowX: 'hidden',
                width: '100%',
                height: '100%',
            },
            flexContainer: {
                display: 'flex',
                height: '100%',
            },
            indicator: {
                backgroundColor: '#6654ad',
            },
        },
        MuiTab: {
            root: {
                marginBottom: 10,
            },
        },
    },
})

const tabTheme = createMuiTheme({
    overrides: {
        MuiTab: {
            labelIcon: {
                minHeight: 0,
                padding: 0,
                paddingTop: 0,
            },
            textColorInherit: {
                opacity: 1,
                color: 'inherit',
            },
            wrapper: {
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                height: '100%',
                fontSize: '10px',
            },
        },
    },
})

const TabPanel = (props) => {
    const { children, value, index, label, height } = props

    return (
        <div
            role='region'
            aria-label={`${label} tab`}
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            // tabIndex={`${index}`}
            style={{
                height: height,
                overflowY: 'auto',
                // borderLeft: '1px solid lightgrey'
            }}
        >
            {value === index && children}
        </div>
    )
}

const TabIcon = (props) => {
    const { icon } = props
    const marginRight = 10
    return (
        <div style={{ flexDirection: 'row' }}>
            <div style={{ marginRight }}>{icon}</div>
        </div>
    )
}

const CustomTab = ({
    width,
    color,
    className,
    label,
    index,
    icon,
    flexDirection,
    setCurrentTab,
}) => {
    // const [useOutline, setOutline] = useState(false)
    const iconJSX = <TabIcon icon={icon} />
    return (
        <ThemeProvider theme={tabTheme}>
            <Tab
                key={index}
                style={{
                    flexDirection,
                    width,
                    maxWidth: width,
                    color,
                }}
                className={className}
                data-test='rightbarTab'
                label={label}
                tabIndex='0'
                value={index}
                onClick={() => {
                    setCurrentTab(index)
                }}
                // onKeyUp={e => {
                //     if (e.key === 'Tab') {
                //         setOutline(true)
                //     }
                // }}
                // onMouseDown={e => {
                //     setOutline(false)
                // }}
                icon={iconJSX}
            />
        </ThemeProvider>
    )
}

const useStyles = makeStyles({
    body: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontSize: '0.95rem',
        color: 'gainsboro',
    },
    content: {
        flex: '1 1 auto',
        paddingTop: '2rem',
    },
    rightbarTabsContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        minHeight: '0', // Set variable height for tabs container
        height: '100%',
        flexShrink: 1,
    },
    rightbarTabs: {
        background: 'white',
        minHeight: 0,
        flexGrow: 0,
        flexShrink: 0,
    },
    rightbarTabsRow: {
        height: 40,
    },
    rightbarTab: {
        padding: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minWidth: '150px',
        overflow: 'visible',
    },
    backButton: {
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '25px',
        color: 'whitesmoke',
    },
})

export default function TrimUI({}): JSX.Element {
    const classes = useStyles()
    const [currentTab, setCurrentTab] = useState<number>(0)

    const tabOptions = () => {
        let flexDirection = 'row'

        const colors = ['rgb(149,117,205)', '#6654ad']
        let options = [
            ['trim', <EditIcon aria-hidden='true' />, <></>],
            ['resolution', <VideocamIcon aria-hidden='true' />, <></>],
        ]
        const w = `${options.length === 0 ? 0 : 100 / options.length}%`
        let tabs: any[] = []
        let panels: any[] = []
        options.forEach(([label, icon, component], index) => {
            const c = index === currentTab ? colors[1] : colors[0]
            tabs.push(
                <CustomTab
                    width={w}
                    color={c}
                    index={index}
                    icon={icon}
                    label={label}
                    flexDirection={flexDirection}
                    className={classes.rightbarTab}
                    setCurrentTab={setCurrentTab}
                />
            )
            panels.push(
                <TabPanel
                    height={'87%'}
                    value={currentTab}
                    index={index}
                    label={label}
                >
                    {component}
                </TabPanel>
            )
        })
        return {
            tabs,
            panels,
        }
    }

    const renderTabsContainer = () => {
        let tabClass = classes.rightbarTabsRow
        const options = tabOptions()
        const tabs = options.tabs
        const panels = options.panels

        return (
            <Paper
                className={classes.rightbarTabsContainer}
                style={{ paddingTop: 10 }}
            >
                <ThemeProvider theme={tabsTheme}>
                    <Tabs
                        className={tabClass}
                        data-test={tabClass}
                        value={currentTab}
                        variant='fullWidth'
                        style={{
                            height: '13%',
                        }}
                        role='region'
                        id='rightbar-tabs'
                    >
                        {tabs}
                    </Tabs>
                </ThemeProvider>
                {panels}
            </Paper>
        )
    }

    return (
        <Container
            maxWidth={false}
            disableGutters
            classes={{ root: classes.body }}
        >
            <Container
                maxWidth={'xl'}
                disableGutters
                classes={{ root: classes.content }}
            >
                <Grid container style={{ justifyContent: 'center' }}>
                    <Grid
                        item
                        style={{
                            margin: 'auto',
                            marginTop: 0,
                            width: '22%',
                            maxWidth: '22%',
                            flexBasis: '22%',
                        }}
                        children={
                            <VideoPlayer
                                styles={{
                                    midWrapper: {
                                        position: 'relative',
                                        zIndex: 1,
                                        background: 'transparent',
                                    },
                                    innerWrapper: {
                                        flexDirection: 'column',
                                    },
                                    video: {
                                        height: 'auto',
                                        width: '100%',
                                        position: 'relative',
                                    },
                                    controlBar: {
                                        height: 70,
                                        maxHeight: 70,
                                        position: 'relative',
                                    },
                                }}
                                dynamicHeights={false}
                                enableFullScreen={false}
                                enableTracking={false}
                                fadeControlBar={false}
                            />
                        }
                    />
                    <Grid
                        item
                        xs={9}
                        style={{
                            margin: 'auto',
                            marginTop: 0,
                        }}
                        children={<TrimPanel />}
                    />
                </Grid>
            </Container>
        </Container>
    )
}
