import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TextInput, TouchableOpacity, 
  ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, StyleSheet 
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import { CommonActions } from '@react-navigation/native';

import { useAuth } from '../../../context/AuthContext';
import { getTeamsMetadataApi, createTeamApi } from '../../../services/teamcreationApi';

export default function CreateTeamScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // --- UI States ---
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [metadata, setMetadata] = useState({ branches: [], semesters: [], sections: [] });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'success' });

  // --- Date Picker States ---
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // --- Form States ---
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 3)));
  const [teamName, setTeamName] = useState('');

  const [members, setMembers] = useState([
    { name: '', email: '', rollNumber: '', role: '', isLeader: true, branchId: '', semesterId: '', sectionId: '' }
  ]);

  useEffect(() => { loadMetadata(); }, []);

  const loadMetadata = async () => {
    try {
      const res = await getTeamsMetadataApi(user.token);
      if (res.success) {
        setMetadata({
          branches: res.data.branches.map(b => ({ label: b.branch_name, value: b.id })),
          semesters: res.data.semesters.map(s => ({ label: s.semester_name, value: s.id })),
          sections: res.data.sections.map(s => ({ label: s.section_name, value: s.id })),
        });
      }
    } catch (e) { showToast("Sync Error", "Could not fetch metadata.", "error"); }
    finally { setLoading(false); }
  };

  const showToast = (title, message, type) => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  const addMember = () => {
    setMembers([...members, { name: '', email: '', rollNumber: '', role: '', isLeader: false, branchId: '', semesterId: '', sectionId: '' }]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    }
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    if (field === 'isLeader' && value === true) {
      newMembers.forEach((m, i) => { if (i !== index) m.isLeader = false; });
    }
    setMembers(newMembers);
  };

  const handleCreateTeam = async () => {
    if (!projectTitle || !teamName || members.some(m => !m.email)) {
      showToast("Fields Missing", "Fill Project title, Team name and all Emails.", "error");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        projectTitle,
        description,
        technologiesUsed: techStack,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        teamName,
        members
      };
      const res = await createTeamApi(user.token, payload);
      if (res.success) showToast("Success", "Squad Deployed!", "success");
    } catch (e) { showToast("Error", e.message, "error"); }
    finally { setSubmitting(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#F5F1E6' }}>
        <StatusBar barStyle="dark-content" />
        
        {/* HEADER */}
        <View style={{ paddingTop: insets.top + 10 }} className="px-6 pb-6 bg-white flex-row items-center justify-between border-b border-[#E2B35E30]">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-11 h-11 items-center justify-center bg-[#1A1A1A] rounded-2xl">
            <Ionicons name="arrow-back" size={20} color="#E2B35E" />
          </TouchableOpacity>
          <Text className="text-xl font-black text-[#1A1A1A]">New <Text className="text-[#E2B35E]">Squad</Text></Text>
          <View className="w-11" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          
          {/* SECTION: SPECS */}
          <View className="bg-white p-6 rounded-[35px] border border-[#E5E5E5] mb-8">
            <SectionHeader title="Project Specs" icon="shield-outline" />
            <CustomInput label="Title" value={projectTitle} onChangeText={setProjectTitle} placeholder="Project Name" icon="briefcase" />
            <CustomInput label="Description" value={description} onChangeText={setDescription} placeholder="About the project" icon="align-left" multiline numberOfLines={3} />
            <CustomInput label="Tech" value={techStack} onChangeText={setTechStack} placeholder="Node, React, etc." icon="code" />
            
            <View className="flex-row justify-between mt-2">
              <DateButton label="Start" date={startDate} onPress={() => setShowStartPicker(true)} />
              <DateButton label="End" date={endDate} onPress={() => setShowEndPicker(true)} />
            </View>
          </View>

          {showStartPicker && (
            <DateTimePicker 
              value={startDate} mode="date" minimumDate={new Date()} 
              onChange={(e, d) => { setShowStartPicker(false); if(d) setStartDate(d); }} 
            />
          )}
          {showEndPicker && (
            <DateTimePicker 
              value={endDate} mode="date" minimumDate={startDate} 
              onChange={(e, d) => { setShowEndPicker(false); if(d) setEndDate(d); }} 
            />
          )}

          <CustomInput label="Squad Identity" value={teamName} onChangeText={setTeamName} placeholder="Team Name" icon="users" />

          {/* DYNAMIC MEMBERS */}
          {members.map((member, index) => (
            <View key={index} className="bg-white p-6 rounded-[35px] border border-[#E2B35E40] mb-4 relative shadow-sm">
              <View className="absolute top-0 right-0 bg-[#1A1A1A] px-4 py-2 rounded-bl-[20px]">
                <Text className="text-[#E2B35E] font-black text-xs">#{index + 1}</Text>
              </View>
              
              <View className="flex-row justify-between mb-4">
                 <Text className="font-black text-[#1A1A1A]">Scholar Info</Text>
                 {index > 0 && <TouchableOpacity onPress={() => removeMember(index)}><Feather name="x" size={18} color="red" /></TouchableOpacity>}
              </View>

              <TextInput placeholder="Full Name" className="bg-[#F8F9FB] p-4 rounded-2xl mb-3 font-bold" value={member.name} onChangeText={v => updateMember(index, 'name', v)} />
              <TextInput placeholder="Email" className="bg-[#F8F9FB] p-4 rounded-2xl mb-3 font-bold" value={member.email} onChangeText={v => updateMember(index, 'email', v)} />
              <TextInput placeholder="Roll Number" className="bg-[#F8F9FB] p-4 rounded-2xl mb-3 font-bold" value={member.rollNumber} onChangeText={v => updateMember(index, 'rollNumber', v)} />

              <View className="flex-row justify-between mb-3">
                <Dropdown style={styles.miniDropdown} data={metadata.branches} labelField="label" valueField="value" placeholder="Branch" value={member.branchId} onChange={i => updateMember(index, 'branchId', i.value)} />
                <Dropdown style={styles.miniDropdown} data={metadata.semesters} labelField="label" valueField="value" placeholder="Sem" value={member.semesterId} onChange={i => updateMember(index, 'semesterId', i.value)} />
              </View>
              <Dropdown style={styles.dropdown} data={metadata.sections} labelField="label" valueField="value" placeholder="Section" value={member.sectionId} onChange={i => updateMember(index, 'sectionId', i.value)} />

              <TouchableOpacity 
                onPress={() => updateMember(index, 'isLeader', !member.isLeader)}
                className={`mt-4 p-4 rounded-2xl flex-row items-center justify-center border-2 ${member.isLeader ? 'bg-[#1A1A1A] border-[#E2B35E]' : 'border-[#EEE]'}`}
              >
                <MaterialCommunityIcons name={member.isLeader ? "crown" : "account"} size={20} color={member.isLeader ? "#E2B35E" : "#D1D1D1"} />
                <Text className={`ml-2 font-black text-[10px] ${member.isLeader ? 'text-[#E2B35E]' : 'text-gray-400'}`}>LEADER</Text>
              </TouchableOpacity>

              {index === members.length - 1 && (
                <TouchableOpacity onPress={addMember} className="mt-6 border-2 border-dashed border-[#E2B35E] p-4 rounded-2xl flex-row justify-center items-center bg-[#E2B35E10]">
                  <Ionicons name="add" size={20} color="#E2B35E" />
                  <Text className="text-[#E2B35E] font-black ml-2 uppercase text-[10px]">Add Next Scholar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity onPress={handleCreateTeam} className="bg-[#1A1A1A] p-6 rounded-[30px] flex-row justify-center items-center mt-6">
             {submitting ? <ActivityIndicator color="#E2B35E" /> : <Text className="text-[#E2B35E] font-black text-lg uppercase">Deploy Squad</Text>}
          </TouchableOpacity>
        </ScrollView>

        <Modal isVisible={modalVisible} onBackdropPress={() => { setModalVisible(false); if(modalConfig.type==='success') navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'TeamList' }] })); }}>
           <View className="bg-white p-8 rounded-[40px] items-center border-4 border-[#E2B35E]">
              <Ionicons name={modalConfig.type==='success'?'checkmark-circle':'alert-circle'} size={60} color={modalConfig.type==='success'?'#E2B35E':'red'} />
              <Text className="mt-4 text-xl font-black">{modalConfig.title}</Text>
              <Text className="mt-2 text-center text-gray-500">{modalConfig.message}</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); if(modalConfig.type==='success') navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'TeamList' }] })); }} className="bg-[#1A1A1A] w-full p-4 rounded-2xl mt-6 items-center">
                <Text className="text-[#E2B35E] font-black">CONTINUE</Text>
              </TouchableOpacity>
           </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const DateButton = ({ label, date, onPress }) => (
  <TouchableOpacity onPress={onPress} className="bg-[#F8F9FB] p-4 rounded-2xl border border-[#EEE] flex-1 mx-1">
    <Text className="text-[10px] font-black text-[#E2B35E] uppercase mb-1">{label}</Text>
    <Text className="text-[#1A1A1A] font-bold">{date.toLocaleDateString('en-IN')}</Text>
  </TouchableOpacity>
);

const SectionHeader = ({ title, icon }) => (
  <View className="flex-row items-center mb-4">
    <View className="w-8 h-8 rounded-xl bg-[#E2B35E20] items-center justify-center"><Ionicons name={icon} size={16} color="#E2B35E" /></View>
    <Text className="text-[#1A1A1A] font-black ml-3 uppercase text-sm">{title}</Text>
  </View>
);

const CustomInput = ({ label, icon, ...props }) => (
  <View className="mb-4">
    <View className="flex-row items-center bg-[#F8F9FB] p-4 rounded-2xl border border-[#EEEEEE]">
      <FontAwesome5 name={icon} size={13} color="#E2B35E" />
      <TextInput {...props} className="flex-1 ml-3 text-[#1A1A1A] font-bold text-sm" placeholderTextColor="#A0A0A0" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  miniDropdown: { flex: 1, height: 55, backgroundColor: '#F8F9FB', borderRadius: 18, paddingHorizontal: 15, marginRight: 10, borderWidth: 1, borderColor: '#EEEEEE' },
  dropdown: { height: 55, backgroundColor: '#F8F9FB', borderRadius: 18, paddingHorizontal: 15, borderWidth: 1, borderColor: '#EEEEEE' },
  selectedText: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A' }
});