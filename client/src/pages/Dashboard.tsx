import { useMemo, useState } from 'react'
import { Layout, Tabs, Button, Space, Typography, Select, DatePicker, message, Card, Statistic, Row, Col, Avatar, Dropdown, Menu } from 'antd'
import { PlusOutlined, LogoutOutlined, UserOutlined, FilterOutlined, CalendarOutlined, SettingOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import { useAuth } from '../context/AuthContext'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useCompleteTask, useReorderTasks } from '../hooks/useTasks'
import type { Task, TaskStatus } from '../types'
import TaskModal from '../components/TaskModal'
import TaskTable from '../components/TaskTable'
import KanbanBoard from '../components/KanbanBoard'

const { Header, Content } = Layout
const { Title, Text } = Typography

type Range = [Dayjs | null, Dayjs | null] | null
type FiltersState = { status?: TaskStatus; range?: Range }

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [filters, setFilters] = useState<FiltersState>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)

  const queryFilters = useMemo(() => ({
    status: filters.status,
    dueFrom: filters.range?.[0]?.toISOString(),
    dueTo: filters.range?.[1]?.toISOString(),
  }), [filters])

  const { data: tasks = [], isLoading } = useTasks(queryFilters)
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const completeTask = useCompleteTask()
  const reorderTasks = useReorderTasks()

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length
    const pending = tasks.filter(t => t.status === 'pending').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const completed = tasks.filter(t => t.status === 'completed').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { total, pending, inProgress, completed, completionRate }
  }, [tasks])

  const onAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const onEdit = (task: Task) => {
    setEditing(task)
    setModalOpen(true)
  }

  const onSubmit = async (payload: { title: string; description?: string; dueDate?: string; status?: TaskStatus }) => {
    try {
      if (editing) {
        await updateTask.mutateAsync({ id: editing._id, payload })
        message.success('Task updated successfully!')
      } else {
        await createTask.mutateAsync(payload)
        message.success('Task created successfully!')
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Action failed. Please try again.')
    }
  }

  const onDelete = async (id: string) => {
    try {
      await deleteTask.mutateAsync(id)
      message.success('Task deleted successfully!')
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Delete failed. Please try again.')
    }
  }

  const onComplete = async (id: string) => {
    try {
      await completeTask.mutateAsync(id)
      message.success('Task marked as completed!')
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Complete failed. Please try again.')
    }
  }

  const onReorder = async (updates: { id: string; status: TaskStatus; order: number }[]) => {
    try {
      await reorderTasks.mutateAsync(updates)
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Reorder failed. Please try again.')
    }
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="dashboard-header">
          <div className="flex items-center gap-4">
            <Title level={3} className="dashboard-title" style={{ color: 'white', margin: 0 }}>
              Task Manager
            </Title>
          </div>
          
          <div className="dashboard-user">
            <Text style={{ color: 'white', fontSize: 'var(--font-size-sm)' }}>
              Welcome back, {user?.name}
            </Text>
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <Avatar 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  cursor: 'pointer',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </div>
      </Header>

      <Content className="app-content">
        <div className="dashboard-content">
          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 'var(--space-6)' }}>
            <Col xs={24} sm={12} md={6}>
              <Card className="fade-in" style={{ textAlign: 'center' }}>
                <Statistic
                  title="Total Tasks"
                  value={taskStats.total}
                  valueStyle={{ color: 'var(--primary-600)' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="fade-in" style={{ textAlign: 'center' }}>
                <Statistic
                  title="Pending"
                  value={taskStats.pending}
                  valueStyle={{ color: 'var(--warning-600)' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="fade-in" style={{ textAlign: 'center' }}>
                <Statistic
                  title="In Progress"
                  value={taskStats.inProgress}
                  valueStyle={{ color: 'var(--primary-600)' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="fade-in" style={{ textAlign: 'center' }}>
                <Statistic
                  title="Completed"
                  value={taskStats.completed}
                  valueStyle={{ color: 'var(--success-600)' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters and Actions */}
          <Card className="dashboard-filters fade-in">
            <div className="flex flex-wrap items-center gap-4" style={{ width: '100%' }}>
          <div className="flex items-center gap-2">
            <FilterOutlined style={{ color: '#6b7280' }} />
            <Text strong style={{ color: '#1f2937' }}>Filters:</Text>
          </div>
              
              <Select
                allowClear
                placeholder="Filter by status"
                value={filters.status}
                onChange={(v) => setFilters((f) => ({ ...f, status: v as TaskStatus | undefined }))}
                options={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Completed', value: 'completed' },
                ]}
                style={{ minWidth: 180 }}
              />
              
              <div className="flex items-center gap-2">
                <CalendarOutlined style={{ color: '#6b7280' }} />
                <DatePicker.RangePicker
                  value={filters.range ?? null}
                  onChange={(v) => setFilters((f) => ({ ...f, range: v }))}
                  placeholder={['Start date', 'End date']}
                />
              </div>

              <div style={{ marginLeft: 'auto' }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={onAdd}
                  size="large"
                  style={{ 
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    height: '40px',
                    paddingLeft: 'var(--space-6)',
                    paddingRight: 'var(--space-6)'
                  }}
                >
                  Add New Task
                </Button>
              </div>
            </div>
          </Card>

          {/* Main Content Tabs */}
          <Card className="dashboard-tabs fade-in">
            <Tabs 
              defaultActiveKey="kanban" 
              size="large"
              items={[
                {
                  key: 'kanban',
                  label: (
                    <span style={{ fontWeight: '500' }}>
                      📋 Kanban Board
                    </span>
                  ),
                  children: (
                    <KanbanBoard
                      tasks={tasks}
                      loading={isLoading}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onComplete={onComplete}
                      onReorder={onReorder}
                    />
                  ),
                },
                {
                  key: 'table',
                  label: (
                    <span style={{ fontWeight: '500' }}>
                      📊 Table View
                    </span>
                  ),
                  children: (
                    <TaskTable
                      tasks={tasks}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onComplete={onComplete}
                    />
                  ),
                },
              ]} 
            />
          </Card>

          <TaskModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            initial={editing}
            onSubmit={onSubmit}
          />
        </div>
      </Content>
    </Layout>
  )
}

export default Dashboard