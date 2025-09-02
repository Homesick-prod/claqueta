// This is a React PDF document component for generating call sheet PDFs
// Note: This requires @react-pdf/renderer to be installed
// If not available, the ExportPDFButton component will fall back to text export

import React from 'react';
import { CallSheetPage } from '../model';

// Mock React PDF components for type safety when package isn't available
interface MockPDFProps {
  children?: React.ReactNode;
  style?: any;
  [key: string]: any;
}

const MockDocument = ({ children, ...props }: MockPDFProps) => React.createElement('div', props, children);
const MockPage = ({ children, ...props }: MockPDFProps) => React.createElement('div', props, children);
const MockView = ({ children, ...props }: MockPDFProps) => React.createElement('div', props, children);
const MockText = ({ children, ...props }: MockPDFProps) => React.createElement('span', props, children);

// Try to import React PDF components, fall back to mocks
let Document, Page, View, Text, StyleSheet;

try {
  const reactPdf = require('@react-pdf/renderer');
  Document = reactPdf.Document;
  Page = reactPdf.Page;
  View = reactPdf.View;
  Text = reactPdf.Text;
  StyleSheet = reactPdf.StyleSheet;
} catch {
  // Fallback for when @react-pdf/renderer is not available
  Document = MockDocument;
  Page = MockPage;
  View = MockView;
  Text = MockText;
  StyleSheet = {
    create: (styles: any) => styles
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textDecoration: 'underline',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    fontWeight: 'bold',
    width: 80,
  },
  value: {
    flex: 1,
  },
  table: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ccc',
    padding: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: 'grey',
  },
});

interface CallsheetDocumentProps {
  page: CallSheetPage;
  projectName: string;
}

export default function CallsheetDocument({ page, projectName }: CallsheetDocumentProps) {
  const formatDate = (dateISO?: string) => {
    if (!dateISO) return 'TBD';
    return new Date(dateISO).toLocaleDateString();
  };

  const formatTime = (time?: string) => time || '--:--';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.header}>{projectName}</Text>
          <Text style={[styles.header, { fontSize: 14 }]}>{page.title}</Text>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(page.dateISO)}</Text>
            {page.dayNumber && (
              <>
                <Text style={styles.label}>Day:</Text>
                <Text style={styles.value}>{page.dayNumber}</Text>
              </>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Crew Call:</Text>
            <Text style={styles.value}>{formatTime(page.crewCall)}</Text>
            {page.company && (
              <>
                <Text style={styles.label}>Company:</Text>
                <Text style={styles.value}>{page.company}</Text>
              </>
            )}
          </View>
        </View>

        {/* Location */}
        {page.location?.name && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOCATION</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{page.location.name}</Text>
            </View>
            {page.location.address && (
              <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{page.location.address}</Text>
              </View>
            )}
            {page.basecamp && (
              <View style={styles.row}>
                <Text style={styles.label}>Basecamp:</Text>
                <Text style={styles.value}>{page.basecamp}</Text>
              </View>
            )}
          </View>
        )}

        {/* Weather */}
        {page.weather?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WEATHER</Text>
            <View style={styles.row}>
              <Text style={styles.value}>{page.weather.summary}</Text>
              {page.weather.tempC && <Text> | {page.weather.tempC}°C</Text>}
            </View>
            {(page.weather.sunrise || page.weather.sunset) && (
              <View style={styles.row}>
                {page.weather.sunrise && <Text>Sunrise: {page.weather.sunrise} </Text>}
                {page.weather.sunset && <Text>Sunset: {page.weather.sunset}</Text>}
              </View>
            )}
          </View>
        )}

        {/* Key Contacts */}
        {page.keyContacts && page.keyContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>KEY CONTACTS</Text>
            {page.keyContacts.map((contact, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.label}>{contact.label}:</Text>
                <Text style={styles.value}>
                  {contact.name} {contact.phone && `| ${contact.phone}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Cast */}
        {page.castCalls.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CAST</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Actor</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Character</Text>
                <Text style={styles.tableCell}>Call</Text>
                <Text style={styles.tableCell}>MU</Text>
                <Text style={styles.tableCell}>WR</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>Pickup</Text>
              </View>
              {page.castCalls.map((cast, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{cast.name || 'TBD'}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{cast.character || ''}</Text>
                  <Text style={styles.tableCell}>{formatTime(cast.callTime)}</Text>
                  <Text style={styles.tableCell}>{formatTime(cast.muTime)}</Text>
                  <Text style={styles.tableCell}>{formatTime(cast.wrTime)}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{cast.pickup || ''}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Crew by Department */}
        {page.crewByDept.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CREW</Text>
            {page.crewByDept.map((dept, deptIndex) => (
              <View key={deptIndex} style={{ marginBottom: 8 }}>
                <Text style={[styles.sectionTitle, { fontSize: 10, textDecoration: 'none', fontWeight: 'bold' }]}>
                  {dept.deptId.toUpperCase()}
                  {dept.deptCall && ` (Call: ${dept.deptCall})`}
                </Text>
                {dept.members.map((member, memberIndex) => (
                  <View key={memberIndex} style={styles.row}>
                    <Text style={styles.value}>
                      {member.name || 'TBD'}
                      {member.position && ` - ${member.position}`}
                      {member.callTime && ` (${member.callTime})`}
                      {member.note && ` | ${member.note}`}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Notes */}
        {page.unitNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UNIT NOTES</Text>
            <Text style={styles.value}>{page.unitNotes}</Text>
          </View>
        )}

        {page.safety && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SAFETY</Text>
            <Text style={styles.value}>{page.safety}</Text>
          </View>
        )}

        {page.emergency?.hospital && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EMERGENCY</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Hospital:</Text>
              <Text style={styles.value}>{page.emergency.hospital.name}</Text>
            </View>
            {page.emergency.hospital.phone && (
              <View style={styles.row}>
                <Text style={styles.label}>Emergency:</Text>
                <Text style={styles.value}>{page.emergency.hospital.phone}</Text>
              </View>
            )}
            {page.emergency.hospital.address && (
              <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{page.emergency.hospital.address}</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Claqueta on {new Date().toLocaleString()}</Text>
        </View>
      </Page>
    </Document>
  );
}