import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { resume } from "../src/content/resume";
import { formatRange } from "../src/lib/dates";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9.5, fontFamily: "Helvetica", color: "#111", lineHeight: 1.4 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  headline: { fontSize: 11, marginTop: 2, color: "#444" },
  contact: { marginTop: 4, color: "#444" },
  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  jobHeader: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  jobTitle: { fontFamily: "Helvetica-Bold" },
  jobDates: { color: "#444" },
  bullet: { flexDirection: "row", marginTop: 2 },
  bulletMark: { width: 10 },
  bulletText: { flex: 1 },
  skillLine: { marginTop: 2 },
  bold: { fontFamily: "Helvetica-Bold" },
});

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item) => (
        <View key={item} style={styles.bullet}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function ResumePdf() {
  const { profile } = resume;
  return (
    <Document title={`${profile.name} — Resume`} author={profile.name}>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.headline}>{profile.headline}</Text>
        <Text style={styles.contact}>
          {profile.location} · {profile.email} ·{" "}
          {profile.links.map((link) => link.url).join(" · ")}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Highlights</Text>
          <Bullets items={resume.highlights} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {resume.experience.map((job) => (
            <View key={`${job.company}-${job.start}`} wrap={false}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>
                  {job.role} · {job.company}
                </Text>
                <Text style={styles.jobDates}>{formatRange(job.start, job.end)}</Text>
              </View>
              <Bullets items={job.achievements} />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {resume.projects.map((project) => (
            <View key={project.name} style={{ marginTop: 4 }} wrap={false}>
              <Text>
                <Text style={styles.bold}>{project.name}</Text> — {project.description}
              </Text>
              {project.links.map((link) => (
                <Link key={link.url} src={link.url}>
                  {link.url}
                </Link>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {resume.skills.map((group) => (
            <Text key={group.category} style={styles.skillLine}>
              <Text style={styles.bold}>{group.category}: </Text>
              {group.items.join(", ")}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <Text>
            {profile.education.degree}, {profile.education.school} ({profile.education.year})
          </Text>
        </View>
      </Page>
    </Document>
  );
}
