"use client"

import usePlanningStore from '@/store/planningStore'
import useProjectMemberStore from '@/store/projectMemberStore'
import useTaskStore from '@/store/taskStore'
import { Project } from '@/types/project.type'
import { getURLParam } from '@/utils/urlUtils'
import React, { useEffect } from 'react'
import Info from './components/containers/Info'
import TabsContainer from './components/containers/TabsContainer'
import { useAppContext } from '@/providers/AppProvider'
import useGeneralStore from '@/store/generalStore'

interface Props {
    slug: string
    project: Project
}

const ClientPage: React.FC<Props> = ({ slug, project }) => { 
    const {setSearchQuery: setProjectSearchQuery , fetchTasks, setProjectSlug, setProject } = useTaskStore();
    const { fetchProjectMembers  } = useProjectMemberStore();

    const {fetchPlanning} = usePlanningStore();

    const {fetchMemberShipStatuses, fetchPlatforms} = useGeneralStore()

    useEffect(() => {
        setProjectSlug(slug)
        const search = getURLParam("search");
        setProjectSearchQuery(search || '')

        const loadMemberShipStatuses = async () => {
            await fetchMemberShipStatuses();
          };

        const loadTasks = async () => {
            await fetchTasks(true);
        };

        const loadProjectMembers = async () => {
            await fetchProjectMembers(true);
        };
       
        const loadPlatforms = async () => {
            await fetchPlatforms();
        };
        const loadPlanning = async () => {
            if(!project.planning) return
            await fetchPlanning(project.planning);
        };
        loadMemberShipStatuses();
        loadTasks();
        loadProjectMembers()
        loadPlatforms()
        loadPlanning()
        setProject(project)
    }, [fetchMemberShipStatuses, fetchPlanning, fetchPlatforms, fetchProjectMembers, fetchTasks, project, project.planning, setProject, setProjectSearchQuery, setProjectSlug, slug]);

  return (
    <>
        <Info />
        <TabsContainer/>
    </>
  )
}

export default ClientPage